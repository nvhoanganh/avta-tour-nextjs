import { last, splitEvery, flatten, sortBy, prop } from 'ramda';
import { doc, deleteDoc } from "firebase/firestore";
var Diacritics = require('diacritic');
import { db } from './firebase';

const PLAYER_GRAPHQL_FIELDS = `
sys { id }
fullName
nickName
avtaPoint
userId
unofficialPoint
pointChangeLog
homeClub
mobileNumber
coverImage {
  url
}
`;

async function fetchGraphQL(query, preview = false) {
  const spaceId = '012zf22jz69j';
  const accesstoken = 'NzV4pmb3TPbXdLT0I3J6HTQ9lAl_URSiTcFyXIsv5OM';
  const previewtoken = 'rAs5ujisVYuwmzlPZJdmji4BBwPLL6d_R6Fg1vJ5eUY';
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview
          ? previewtoken
          : accesstoken
          }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}

export async function getPlayerById(id, preview) {
  const entries = await fetchGraphQL(
    `query {
      playerCollection(where: { sys: { id: "${id}" } }, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return entries?.data?.playerCollection?.items?.[0]
}

export const getPlayers = (allPlayers, sortBy, filter, maxPoint, playerStyle) => {
  const getDiff = (a, b) => {
    var nameA = a?.toUpperCase();
    var nameB = b?.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const sorted = allPlayers.sort((a, b) => {
    if (sortBy === 'Point') {
      return b.avtaPoint > a.avtaPoint ? 1 : -1;
    }
    if (sortBy === 'Club') {
      return getDiff(a.homeClub, b.homeClub);
    }

    if (sortBy === 'Name') {
      return getDiff(a.fullName, b.fullName);
    }
  });

  if (filter?.trim()) {
    // less than
    const range = filter?.match(/(?<point1>\d+)\s*-\s*(?<point2>\d+)/);
    const lessThanPoint = filter?.match(/<\s*(?<point>\d+)/);
    const moreThanPoint = filter?.match(/>\s*(?<point>\d+)/);
    if (range) {
      sorted = sorted.filter(x =>
        +x.avtaPoint?.toString() <= +range[2] &&
        +x.avtaPoint?.toString() >= +range[1]
      );
    } else if (lessThanPoint) {
      sorted = sorted.filter(x =>
        +x.avtaPoint?.toString() <= +lessThanPoint[1]
      );
    } else if (moreThanPoint) {
      sorted = sorted.filter(x =>
        +x.avtaPoint?.toString() >= +moreThanPoint[1]
      );
    } else {
      // search name
      const cleaned = Diacritics.clean(filter.toLowerCase().trim());
      sorted = sorted.filter(x =>
        Diacritics.clean(x.nickName || '').toLowerCase().indexOf(cleaned) >= 0 ||
        Diacritics.clean(x.fullName || '').toLowerCase().indexOf(cleaned) >= 0 ||
        Diacritics.clean(x.homeClub || '').toLowerCase().indexOf(cleaned) >= 0 ||
        (
          +x.avtaPoint?.toString() >= +cleaned
        ));
    }
  }

  if (playerStyle && playerStyle !== 'All') {
    sorted = sorted.filter(x =>
      x.playStyle === playerStyle);
  }

  if (!!maxPoint) {
    sorted = sorted.filter(x => +x.avtaPoint?.toString() <= maxPoint)
  }
  return sorted;
}

export const getSchedules = (allMatches, filter) => {
  const originalIndex = allMatches.map((m, index) => ({ ...m, matchOrder: index }));
  if (filter?.trim()) {
    const cleaned = Diacritics.clean(filter.toLowerCase().trim());
    return originalIndex.filter(x => {
      return Diacritics.clean(x.between[0].player1.fullName || x.between[0].players[0]?.fullName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(x.between[0].player2.fullName || x.between[0].players[1]?.fullName).toLowerCase().startsWith(cleaned) ||

        Diacritics.clean(x.between[1].player1.fullName || x.between[1].players[0]?.fullName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(x.between[1].player2.fullName || x.between[1].players[1]?.fullName).toLowerCase().startsWith(cleaned) ||

        Diacritics.clean(x.between[0].player1.nickName || x.between[0].players[0]?.nickName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(x.between[0].player2.nickName || x.between[0].players[1]?.nickName).toLowerCase().startsWith(cleaned) ||

        Diacritics.clean(x.between[1].player1.nickName || x.between[1].players[0]?.nickName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(x.between[1].player2.nickName || x.between[1].players[1]?.nickName).toLowerCase().startsWith(cleaned)
    }
    )
  }

  return originalIndex;
}

export const getFilteredMatches = (allMatches, filter) => {
  if (filter?.trim()) {
    const cleaned = Diacritics.clean(filter.toLowerCase().trim());
    return allMatches.filter(x => {
      const w1 = x.winners.player1 || x.winners.players[0];
      const w2 = x.winners.player2 || x.winners.players[1];

      const l1 = x.losers.player1 || x.losers.players[0];
      const l2 = x.losers.player2 || x.losers.players[1];

      return Diacritics.clean(w1?.fullName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(w2?.fullName).toLowerCase().startsWith(cleaned) ||

        Diacritics.clean(l1?.fullName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(l2?.fullName).toLowerCase().startsWith(cleaned) ||

        Diacritics.clean(w1?.nickName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(w2?.nickName).toLowerCase().startsWith(cleaned) ||

        Diacritics.clean(l1?.nickName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(l2?.nickName).toLowerCase().startsWith(cleaned)
    }
    )
  }

  return allMatches;
}

export const getFilteredLadderMatches = (allMatches, filter) => {
  if (filter?.trim()) {
    const cleaned = Diacritics.clean(filter.toLowerCase().trim());
    return allMatches.filter(x =>
      Diacritics.clean(x.winnerUser1?.displayName || x.winnerUser1?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.winnerUser2?.displayName || x.winnerUser2?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.loserUser1?.displayName || x.loserUser1?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.loserUser2?.displayName || x.loserUser2?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.winnerUser1?.nickName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.winnerUser2?.nickName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.loserUser1?.nickName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.loserUser2?.nickName).toLowerCase().startsWith(cleaned)
    )
  }

  return allMatches;
}

export const score = {
  GROUP_STAGE: 'Group Stage',
  KNOCKOUT_STAGE: 'Knockout Stage'
}

export function arrayShuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

export const getCompGroups = (allTeams, teamsInEachGroup) => {
  const groups = splitEvery(teamsInEachGroup, arrayShuffle(allTeams));

  let lastGroup = last(groups);
  if (lastGroup.length < teamsInEachGroup) {
    const teamsBeforeLast = groups.slice(0, groups.length - 1);
    for (let index = 0; index < lastGroup.length; index++) {
      teamsBeforeLast[index].push(lastGroup[index])
    }

    // drop the last group
    groups = teamsBeforeLast;
  }

  return groups.reduce((p, c, index) => {
    const groupName = GROUPNAMES[index];
    return {
      ...p,
      [groupName]: c
    }
  }, {});
}

export const exportGroupsAllocation = (groups) => {
  const out = Object.keys(groups).map(x => {
    const teams = groups[x];
    return teams.map(team => `${x}:${team.players[0].fullName.trim()} + ${team.players[1].fullName.trim()}`);
  });

  return flatten(out);
}

export const getAllGroupMatches = (groups) => {
  const sortByGroup = sortBy(prop('group'));

  const results = Object.keys(groups).map(groupName => {
    const teams = groups[groupName].map(team => `${team.players[0].fullName.trim()} + ${team.players[1].fullName.trim()}`);

    var computeNchooseK = teams.flatMap(
      (v, i) => teams.slice(i + 1).map(w => [v, w])
    );

    // temporary solution for now
    const matches = computeNchooseK.map(x => {
      return `Group ${groupName}: ${x[0]} vs ${x[1]}`;
    });

    if (groups[groupName].length === 4) {
      // best match allocation when there are 4 in a group
      const secondMatch = matches[1];
      matches[1] = matches[5];
      matches[5] = secondMatch;
    }

    return {
      group: groupName,
      matches: matches
    }
  });

  return sortByGroup(results);
}

export const getAllGroupMatchesfull = (groups, courts) => {
  const sortByGroup = sortBy(prop('group'));

  const results = Object.keys(groups).map(groupName => {

    const teams = groups[groupName];

    var computeNchooseK = teams.flatMap(
      (v, i) => teams.slice(i + 1).map(w => [v, w])
    );

    const matches = computeNchooseK.map(x => {
      return {
        id: `${x[0].id}-${x[1].id}`,
        group: groupName,
        between: x
      };
    });

    if (groups[groupName].length === 4) {
      // best match allocation when there are 4 in a group
      const secondMatch = matches[1];
      matches[1] = matches[5];
      matches[5] = secondMatch;
    }

    return {
      group: groupName,
      matches: matches
    }
  });

  const matchesByGroup = sortByGroup(results).reduce((pre, cur) => {
    return {
      ...pre,
      [cur.group]: cur.matches
    }
  }, {});

  // map group to courts
  const matchesByGroupValues = Object.values(matchesByGroup);

  return courts.split(',').reduce((pre, court, index) => {
    return {
      ...pre,
      ['Court ' + court]: matchesByGroupValues[index] || []
    }
  }, {})
}

export const GROUPNAMES = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
export const GroupsColours = {
  'A': 'red',
  'B': 'green',
  'C': 'yellow',
  'D': 'blue',
  'E': 'indigo',
  'F': 'purple',
  'G': 'pink',
  'H': 'yellow',
  'I': 'green',
  'J': 'green',
  'K': 'green',
  'L': 'green',
  'M': 'green',
  'N': 'green',
  'O': 'green',
  'P': 'green',
  'Q': 'green',
  'R': 'green',
  'S': 'green',
  'T': 'green',
  'U': 'green',
  'V': 'green',
  'W': 'green',
  'X': 'green',
  'Y': 'green',
  'Z': 'green'
}

export const getPlayer = (team, index) => {
  return team.players ? team.players[index] : index === 0 ? team.player1 : team.player2;
}

// https://gist.github.com/axelpale/3118596
export function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;
  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }
  // K-sized set has only one K-sized subset.
  if (k == set.length) {
    return [set];
  }
  // There is N 1-sized subsets in a N-sized set.
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  // Assert {1 < k < set.length}
  // Algorithm description:
  // To get k-combinations of a set, we want to join each element
  // with all (k-1)-combinations of the other elements. The set of
  // these k-sized sets would be the desired result. However, as we
  // represent sets with lists, we need to take duplicates into
  // account. To avoid producing duplicates and also unnecessary
  // computing, we use the following approach: each element i
  // divides the list into three: the preceding elements, the
  // current element i, and the subsequent elements. For the first
  // element, the list of preceding elements is empty. For element i,
  // we compute the (k-1)-computations of the subsequent elements,
  // join each with the element i, and store the joined to the set of
  // computed k-combinations. We do not need to take the preceding
  // elements into account, because they have already been the i:th
  // element so they are already computed and stored. When the length
  // of the subsequent list drops below (k-1), we cannot find any
  // (k-1)-combs, hence the upper limit for the iteration:
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

export function getMatchups(players) {
  const matches = k_combinations(players, 4);
  const sortByPoint = sortBy(prop('pointDiff'));
  return sortByPoint(matches.map(x => {
    return {
      team1: {
        player1: x[0].fullName,
        player2: x[1].fullName,
        point: x[0].avtaPoint + x[1].avtaPoint
      },
      team2: {
        player1: x[2].fullName,
        player2: x[3].fullName,
        point: x[2].avtaPoint + x[3].avtaPoint
      },
      pointDiff: Math.abs((x[0].avtaPoint + x[1].avtaPoint) - (x[2].avtaPoint + x[3].avtaPoint))
    }
  }).filter(x => x.pointDiff <= 50)
  );
}

export async function RevalidatePath(user, path) {
  console.log("Revalidating path from browser", path)
  try {
    const token = await user.getIdToken();
    const result = await fetch(
      `/api/revalidate?path=${encodeURIComponent(path)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('revalidate result', result.json());
  } catch (error) {
    console.log('revalidate failed', error);
  }
}

export function CleanUser(player, properties) {
  if (!player) return;
  properties.split(',').forEach(element => {
    delete player[element];
  });
}

export function getFBUserIdFromContentfulId(players, id) {
  return players.find(x => x.sys.id === id)?.uid || '';
}

export function getWinningScoreForComp(result) {
  if (result.stage === 'Group Stage') return 6;
  if (result.gameWonByLoser >= 5) return 7;
  return 6;
}

export function parseMsg(player, msg) {
  msg = msg.replace(new RegExp("%name%", "g"), player.fullName.split(" ")[0]);
  msg = msg.replace(new RegExp("%fullname%", "g"), player.fullName);
  msg = msg.replace(new RegExp("%id%", "g"), player.sys?.id);
  msg = msg.replace(new RegExp("%club%", "g"), player.club || 'Unknown Club');
  msg = msg.replace(new RegExp("%url%", "g"), `https://avtatour.com/players/${player.sys?.id}`);
  msg = msg.replace(new RegExp("%unsubscribe%", "g"), `https://avtatour.com/api/unsubscribe?uid=${player.sys?.id}`);
  return msg;
}

export async function removeRegisteredPlayer(competition, player) {
  await deleteDoc(doc(db, "competition_interested_players", `${competition.sys.id}_${player.sys.id}`));
};

export function getPriceId(competition, team) {
  // return team.isOverLimit ? 'price_1L1IWOBPoOGe9JMqT0vFSQdF' : 'price_1L15ziBPoOGe9JMqOOj1CAYV'
  return team.isOverLimit ? competition.stripePriceWhenOverPointLimit : competition.stripePriceId
}