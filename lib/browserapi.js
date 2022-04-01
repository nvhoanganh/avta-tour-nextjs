import { last, splitEvery, flatten, sortBy, prop, match } from 'ramda';
var Diacritics = require('diacritic');

const PLAYER_GRAPHQL_FIELDS = `
sys { id }
fullName
nickName
avtaPoint
userId
unofficialPoint
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

export const getPlayers = (allPlayers, sortBy, filter, maxPoint) => {
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
      const cleaned = Diacritics.clean(filter.toLowerCase().trim());
      sorted = sorted.filter(x =>
        Diacritics.clean(x.nickName).toLowerCase().startsWith(cleaned) ||
        Diacritics.clean(x.fullName).toLowerCase().split(' ').filter(c => c.startsWith(cleaned)).length > 0 ||
        x.homeClub?.toLowerCase().split(' ').filter(c => c.startsWith(cleaned)).length > 0 ||
        (
          +x.avtaPoint?.toString() >= +cleaned
        ));
    }
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
    return originalIndex.filter(x =>
      Diacritics.clean(x.between[0].name).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.between[1].name).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.between[0].players[0]?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.between[0].players[1]?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.between[1].players[0]?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.between[1].players[1]?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.between[0].players[0]?.nickName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.between[0].players[1]?.nickName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.between[1].players[0]?.nickName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.between[1].players[1]?.nickName).toLowerCase().startsWith(cleaned)
    )
  }

  return originalIndex;
}

export const getFilteredMatches = (allMatches, filter) => {
  if (filter?.trim()) {
    const cleaned = Diacritics.clean(filter.toLowerCase().trim());
    return allMatches.filter(x =>
      Diacritics.clean(x.winners.players[0]?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.winners.players[1]?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.losers.players[0]?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.losers.players[1]?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.winners.players[0]?.nickName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.winners.players[1]?.nickName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.losers.players[0]?.nickName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.losers.players[1]?.nickName).toLowerCase().startsWith(cleaned)
    )
  }

  return allMatches;
}

export const getFilteredLadderMatches = (allMatches, filter) => {
  if (filter?.trim()) {
    const cleaned = Diacritics.clean(filter.toLowerCase().trim());
    return allMatches.filter(x =>
      Diacritics.clean(x.winnerUser1?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.winnerUser2?.fullName).toLowerCase().startsWith(cleaned) ||

      Diacritics.clean(x.loserUser1?.fullName).toLowerCase().startsWith(cleaned) ||
      Diacritics.clean(x.loserUser2?.fullName).toLowerCase().startsWith(cleaned) ||

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
        id: `${x[0].sys.id}-${x[1].sys.id}`,
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