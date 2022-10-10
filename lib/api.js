const R = require('ramda');
const csv = require('csvtojson');

const POST_GRAPHQL_FIELDS = `
slug
title
coverImage {
  url
}
date
author {
  name
  picture {
    url
  }
}
excerpt
content {
  json
}
`;

const SPONSORPLAYER_GRAPHQL_FIELDS = `
name
player {
  sys { id }
  fullName
  nickName
  avtaPoint
  unofficialPoint
  userId
  homeClub
  mobileNumber
  pointChangeLog
  coverImage {
    url
  }
}
competitionsSponsored
`;

const PASTCHAMPIONS_GRAPHQL_FIELDS = `
tournament {
  sys { id }
  title
  slug
  excerpt
  date
  maxPoint
  club
}
playersCollection {
  items {
    sys { id }
    fullName
    nickName
    avtaPoint
    unofficialPoint
    userId
    homeClub
    mobileNumber
    pointChangeLog
    coverImage {
      url
    }
  }
}
`;

const PLAYER_GRAPHQL_FIELDS = `
sys { id }
fullName
nickName
avtaPoint
unofficialPoint
userId
homeClub
mobileNumber
pointChangeLog
coverImage {
  url
}
`;

const PLAYER_DETAILS_GRAPHQL_FIELDS = `
sys { id }
fullName
nickName
avtaPoint
unofficialPoint
userId
homeClub
mobileNumber
pointChangeLog
forehandYoutubeVideo
backhandYoutubeVideo
serveYoutubeVideo
volleyYoutubeVideo
coverImage {
  url
}
`;

const SPONSORS_GRAPHQL_FIELDS = `
sys { id }
name
website
logo {
  url
}
`;

const RULES_GRAPHQL_FIELDS = `
sys { id }
name
rule {
  json
}
`;

const COMPETITION_GRAPHQL_FIELDS_HOME = `
  sys { id }
  title
  slug
  excerpt
  date
  maxPoint
  club
  active
  type
  costPerTeam
  minimumNumberOfTeams
  applicationGForm
  heroImage {
    url
  }
  teamsCollection(preview: false) {
    items {
      name
    }
  }
`;

const COMPETITION_GRAPHQL_FIELDS = `
sys { id }
title
ruleId
organizerContactDetails
slug
location {
  lon
  lat
}
excerpt
description {
  json
}
date
costPerTeam
maxPoint
allowMaxPointOverTheLimit
additionalCostWhenLimit
stripePriceId
stripePriceWhenOverPointLimit
club
active
applicationGForm
type
googleForm
resultSheets
rankingSheet
type
heroImage {
  url
}
teamsCollection(preview: false) {
  items {
    sys {
      id
    }
  }
}
`;

const TEAM_GRAPHQL_FIELDS = `
name
sys { id }
playersCollection(preview: false) {
  items {
    sys { id }
    fullName
    nickName
    avtaPoint
  }
}
`;

async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview
          ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
          : process.env.CONTENTFUL_ACCESS_TOKEN
          }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}

async function downloadCsvFile(query) {
  return fetch(query).then((response) => response.text());
}

function extractPost(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items?.[0];
}

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items;
}

function extractPlayerEntries(fetchResponse) {
  return fetchResponse?.data?.playerCollection?.items;
}

function extractPastChampionsEntries(fetchResponse) {
  return fetchResponse?.data?.pastChampionsCollection?.items;
}

function extractSponsorsEntries(fetchResponse) {
  return fetchResponse?.data?.sponsorsCollection?.items;
}

function extractRulesEntries(fetchResponse) {
  return fetchResponse?.data?.rulesCollection?.items;
}

function extractPlayer(fetchResponse) {
  return fetchResponse?.data?.playerCollection?.items?.[0];
}

function extractCompetitionsEntries(fetchResponse) {
  return fetchResponse?.data?.competitionCollection?.items;
}

function extractTeamsEntries(fetchResponse) {
  return fetchResponse?.data?.teamCollection?.items;
}

function extractCompetition(fetchResponse) {
  return fetchResponse?.data?.competitionCollection?.items?.[0];
}

export async function getPreviewPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  );
  return extractPost(entry);
}

export async function getAllPostsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPostEntries(entries);
}

export async function getTop10Players(preview) {
  const entries = await fetchGraphQL(
    `query {
      playerCollection(order: avtaPoint_DESC, preview: ${preview ? 'true' : 'false'
    }, limit: 10) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPlayerEntries(entries);
}

export async function getSponsorPlayers(preview) {
  const entries = await fetchGraphQL(
    `query {
      sponsorPlayersCollection(preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${SPONSORPLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return entries?.data?.sponsorPlayersCollection?.items;
}

export async function getPastChampions(preview) {
  const entries = await fetchGraphQL(
    `query {
      pastChampionsCollection(preview: ${preview ? 'true' : 'false'
    }, limit: 10) {
        items {
          ${PASTCHAMPIONS_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPastChampionsEntries(entries);
}

export async function getAllSponsors(preview) {
  const entries = await fetchGraphQL(
    `query {
      sponsorsCollection(order: order_ASC, preview: ${preview ? 'true' : 'false'
    }, limit: 10) {
        items {
          ${SPONSORS_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractSponsorsEntries(entries);
}

export async function getRulebyId(id, preview) {
  const entries = await fetchGraphQL(
    `query {
      rulesCollection(where: { sys: { id: "${id}" } }, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${RULES_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractRulesEntries(entries);
}

export async function getAllPlayers(preview) {
  const entries = await fetchGraphQL(
    `query {
      playerCollection(order: avtaPoint_DESC, preview: ${preview ? 'true' : 'false'
    }, limit: 1000) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPlayerEntries(entries);
}

export async function getPlayerById(nickName, preview) {
  const entries = await fetchGraphQL(
    `query {
      playerCollection(where: { sys: { id: "${nickName}" } }, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${PLAYER_DETAILS_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractPlayer(entries);
}

export async function getAllCompetitionsForHome(preview, getall = false) {
  const entries = await fetchGraphQL(
    `query {
      competitionCollection(order: date_DESC ${getall ? '' : ', where: { active: true }'}, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${COMPETITION_GRAPHQL_FIELDS_HOME}
        }
      }
    }`
  );
  return extractCompetitionsEntries(entries);
}

export async function getCompetitionBySlug(slug, preview) {
  let entries = await fetchGraphQL(
    `query {
      competitionCollection(where: { slug: "${slug}" }, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          ${COMPETITION_GRAPHQL_FIELDS}
        }
      }
    }`
  );

  let competition = extractCompetition(entries);

  entries = await fetchGraphQL(
    `query {
      competitionCollection(where: { slug: "${slug}" }, preview: ${preview ? 'true' : 'false'
    }) {
        items {
          mediaCollection(preview: false) {
            items {
              url
            }
          }
        }
      }
    }`
  );

  competition = {
    ...competition,
    ...extractCompetition(entries),
  };

  if (competition.teamsCollection.items.length > 0) {
    // get each Team information
    const teamIdsquery = competition.teamsCollection.items
      .map((x) => `{ sys: { id : "${x.sys.id}"} }`)
      .join(',\n');

    entries = await fetchGraphQL(
      `query {
      teamCollection(where: {
        OR: [
          ${teamIdsquery}
        ]
       }, preview: ${preview ? 'true' : 'false'}) {
        items {
          name
          sys { id }
          playersCollection(preview: false) {
            items {
              sys { id }
            }
          }
        }
      }
    }`
    );

    const teams = extractTeamsEntries(entries);

    competition = {
      ...competition,
      teams,
    };


    const playerIds = R.flatten(teams.map(team => team.playersCollection.items.map(item => item.sys.id)));

    const playerIdQuery = playerIds
      .map((x) => `{ sys: { id : "${x}"} }`)
      .join(',\n');

    entries = await fetchGraphQL(
      `query {
      playerCollection(where: {
        OR: [
          ${playerIdQuery}
        ]
       }, preview: ${preview ? 'true' : 'false'}) {
        items {
          ${PLAYER_GRAPHQL_FIELDS}
        }
      }
    }`
    );

    const players = extractPlayerEntries(entries);

    competition.teams = competition.teams.map(team => {
      return {
        ...team,
        players: team.playersCollection.items.map(player => {
          const p = players.find(p => p.sys.id === player.sys.id);

          return {
            ...player,
            ...p
          };
        })
      }
    });
  }

  return competition;
}

export async function getAllPostsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'
    }, limit: 5) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );
  return extractPostEntries(entries);
}

export async function getPostAndMorePosts(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${preview ? 'true' : 'false'
    }, limit: 5) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );

  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  };
}


const _findPlayer = (players, name) => {
  const found = players.find(p => p.nickName.toLowerCase() === name.toLowerCase());
  return found;
};

const _getPlayerName = (player, name) => {
  return player ? `${player.fullName} [${player?.avtaPoint}]` : `${name} [-]`;
};

const _parseTeam = (players, team) => {
  const groupName = team.split(':')[0].trim()
  const teamName = team.split(':')[1].trim()

  const player1 = teamName.split('+')[0].trim()
  const player2 = teamName.split('+')[1].trim()

  const p1 = _findPlayer(players, player1);
  const p2 = _findPlayer(players, player2);

  return {
    groupName,
    player1: { ...p1, displayName: _getPlayerName(p1, player1) },
    player2: { ...p2, displayName: _getPlayerName(p2, player2) },
  }
};


export async function downloadTournamentResults(url) {
  const players = await getAllPlayers();
  const data = await downloadCsvFile(url);
  const rows = await csv().fromString(data);

  const result = rows.filter(x => !!x.Timestamp).map(row => {
    const datetime = row.Timestamp;
    const winners = _parseTeam(players, row['Đội thắng']);
    const losers = _parseTeam(players, row['Đội Thua']);
    const score = row['Tỉ số 6 - ?'];

    return {
      message: `${winners.player1.displayName} and ${winners.player2.displayName} (group ${winners.groupName}) defeated ${losers.player1.displayName} and ${losers.player2.displayName} (group ${losers.groupName}) by 6-${score}`,
      winners,
      losers,
      datetime,
      score: +score
    }
  })
    .sort((row1, row2) => {
      if (new Date(row1.datetime) > new Date(row2.datetime)) {
        return -1;
      }
      if (new Date(row1.datetime) < new Date(row2.datetime)) {
        return 1;
      }
      return 0;
    });

  return result;
}

export async function downloadTournamentRankingResults(url) {
  const players = await getAllPlayers();
  const data = await downloadCsvFile(url);
  const rows = await csv().fromString(data);

  const result = rows.filter(x => x.Team !== '#N/A').map(row => {
    const team = _parseTeam(players, row.Team);

    return {
      ...row,
      ...team
    }
  });

  const groups = R.groupBy((x) => x.Group, result);
  return groups;
}

export const getGroupStageStanding = (data, groupAllocations) => {
  var filtered = data.filter(x => x.stage === 'Group Stage');

  var groupedbyGroup = R.groupBy(x => x.group, filtered);

  var result = Object.keys(groupedbyGroup).reduce((pre, curr) => {
    var matchesInGroup = groupedbyGroup[curr];
    var resultForGroup = {};

    matchesInGroup.forEach(match => {
      // check winners
      let currentTeam = resultForGroup[match.winners.id]

      if (!resultForGroup[match.winners.id]) {
        resultForGroup[match.winners.id] = {
          win: 1,
          name: '',
          lost: 0,
          gameWin: 6,
          teamId: match.winnerTeamId,
          gameLost: match.gameWonByLoser,
          players: [match.winners.player1, match.winners.player2]
        };
      } else {
        resultForGroup[match.winners.id] = {
          ...currentTeam,
          win: currentTeam.win + 1,
          gameWin: currentTeam.gameWin + 6,
          gameLost: currentTeam.gameLost + match.gameWonByLoser,
        };
      }

      currentTeam = resultForGroup[match.winners.id]
      resultForGroup[match.winners.id] = {
        ...currentTeam,
        diff: currentTeam.gameWin - currentTeam.gameLost
      };

      // check losers
      currentTeam = resultForGroup[match.losers.id]

      if (!resultForGroup[match.losers.id]) {
        resultForGroup[match.losers.id] = {
          win: 0,
          name: '',
          lost: 1,
          teamId: match.loserTeamId,
          gameWin: match.gameWonByLoser,
          gameLost: 6,
          players: [match.losers.player1, match.losers.player2]
        };
      } else {
        resultForGroup[match.losers.id] = {
          ...currentTeam,
          lost: currentTeam.lost + 1,
          gameWin: currentTeam.gameWin + match.gameWonByLoser,
          gameLost: currentTeam.gameLost + 6,
        };
      }

      currentTeam = resultForGroup[match.losers.id]
      resultForGroup[match.losers.id] = {
        ...currentTeam,
        diff: currentTeam.gameWin - currentTeam.gameLost
      };
    });

    return {
      ...pre,
      [curr]: resultForGroup
    }
  }, {});

  var allresults = R.flatten(Object.values(result).map(x => Object.values(x)));

  // merge with group allocations

  const final = Object.keys(groupAllocations).reduce((pre, cur) => {
    const teams = groupAllocations[cur].map((teamAlloc) => {
      const result = allresults.find(matchResult => matchResult.teamId === teamAlloc.id);
      return {
        ...teamAlloc,
        win: 0,
        lost: 0,
        diff: -1000,
        ...result
      }
    });

    // sort by Set won and then game won , if the same then sort by head to head
    var sorted = R.values(teams).sort((a, b) => {
      if (a.win === b.win) {
        if (a.diff === b.diff) {
          // sort by head to head
          const teamAWon = filtered.find(x => x.winnerTeamId === a.teamId && x.loserTeamId === b.teamId);
          const teamBWon = filtered.find(x => x.winnerTeamId === b.teamId && x.loserTeamId === a.teamId);
          if (teamAWon) return -1;
          if (teamBWon) return 1;
          return 0;
        } else {
          return b.diff > a.diff ? 1 : -1;
        }
      } else {
        return b.win > a.win ? 1 : -1;
      }
    })

    return {
      ...pre,
      [cur]: sorted
    }
  }, {});

  return final;
}


export const GetLadderStanding = (matches, allUsers, ladderDetails) => {
  var ranking = {};

  matches.forEach(match => {
    // check winners
    const winners = ['1', '2'];
    winners.forEach(k => {
      const player = ranking[match[`winner${k}`]];
      const fuser = allUsers.find(u => u.uid === match[`winnerUser${k}`].uid || u.sys.id === match[`winner${k}`]);

      if (!player) {
        ranking[match[`winner${k}`]] = {
          win: 1,
          lost: 0,
          gameWin: +match.gameWonByWinners,
          gameLost: +match.gameWonByLosers,
          player: { ...match[`winnerUser${k}`], ...fuser, playerId: match[`winner${k}`] }
        };
      } else {
        ranking[match[`winner${k}`]] = {
          ...player,
          win: player.win + 1,
          gameWin: player.gameWin + match.gameWonByWinners,
          gameLost: player.gameLost + match.gameWonByLosers,
        };
      }
    });

    // check Losers
    const losers = ['1', '2'];
    losers.forEach(k => {
      let player = ranking[match[`loser${k}`]]
      const fuser = allUsers.find(u => u.uid === match[`loserUser${k}`].uid || u.sys.id === match[`loser${k}`]);

      if (!player) {
        ranking[match[`loser${k}`]] = {
          win: 0,
          lost: 1,
          gameWin: +match.gameWonByLosers,
          gameLost: +match.gameWonByWinners,
          player: { ...match[`loserUser${k}`], ...fuser, playerId: match[`loser${k}`] }
        };
      } else {
        ranking[match[`loser${k}`]] = {
          ...player,
          lost: player.lost + 1,
          gameWin: player.gameWin + match.gameWonByLosers,
          gameLost: player.gameLost + match.gameWonByWinners,
        };
      }
    });
  });

  let sorted = R.values(ranking).map(x => ({
    ...x,
    matchPlayed: x.win + x.lost,
    winPercentage: +((x.gameWin / (x.gameLost || 1)) * 100).toFixed(2),
    matchWinPercentage: +((x.win / (x.lost + x.win)) * 100).toFixed(2)
  }));


  if (ladderDetails.orderRule === 'GAMEWON') {
    sorted = sorted.sort((a, b) => {
      if (a.winPercentage === b.winPercentage) {
        return b.win > a.win ? 1 : -1;
      } else {
        return b.winPercentage > a.winPercentage ? 1 : -1;
      }
    })
  } else if (ladderDetails.orderRule === 'SETWON') {
    sorted = sorted.sort((a, b) => {
      if (a.matchWinPercentage === b.matchWinPercentage) {
        return b.winPercentage > a.winPercentage ? 1 : -1;
      } else {
        return b.matchWinPercentage > a.matchWinPercentage ? 1 : -1;
      }
    })
  }


  return sorted;
}
