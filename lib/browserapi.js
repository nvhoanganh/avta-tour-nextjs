import { splitEvery, flatten, sortBy, prop, match } from 'ramda';

const PLAYER_GRAPHQL_FIELDS = `
sys { id }
fullName
nickName
avtaPoint
userId
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

export const getPlayers = (allPlayers, sortBy, filter) => {
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
    const filter2 = filter.toLowerCase().trim();
    return sorted.filter(x =>
      x.fullName.toLowerCase().startsWith(filter2) ||
      x.nickName.toLowerCase().startsWith(filter2) ||
      x.homeClub?.toLowerCase().startsWith(filter2) ||
      (
        +x.avtaPoint?.toString() >= +filter2
      ))
  }

  return sorted;
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