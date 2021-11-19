require("dotenv").config();

const fetch = require("isomorphic-unfetch");

async function downloadMatchResult(query) {
  return fetch(query).then((response) => response.text());
}

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

async function test() {
  const entries = await fetchGraphQL(
    `query {
      playerCollection(order: avtaPoint_DESC, preview: false) {
        items {
          sys { id }
          fullName
          nickName
          avtaPoint
          userId
        }
      }
    }`
  );

  const players = entries.data.playerCollection.items;

  const data = await downloadMatchResult('https://docs.google.com/spreadsheets/d/e/2PACX-1vQx9LAZT8ZuEXFPEVpNwEo9h_GI9Sv0uNvYij32BMqZGe3xHSV16koU5JdY-0wA68eGwRHRuMtmhCqr/pub?gid=748942493&single=true&output=csv');

  var rows = data.split('\n');
  let firstrow = true;

  const findPlayer = name => {
    const found = players.find(p => p.nickName.toLowerCase() === name.toLowerCase());
    return found;
  };

  const getPlayerName = (player, name) => {
    return player ? `${player.fullName} [${player.avtaPoint}]` : `${name} [-]`;
  };

  const parseTeam = (team) => {
    // B: Thang Donvale + Quan Kingsbury
    const groupName = team.split(':')[0].trim()
    const teamName = team.split(':')[1].trim()

    const player1 = teamName.split('+')[0].trim()
    const player2 = teamName.split('+')[1].trim()

    const p1 = findPlayer(player1);
    const p2 = findPlayer(player2);

    return {
      groupName,
      player1: { ...p1, displayName: getPlayerName(p1, player1) },
      player2: { ...p2, displayName: getPlayerName(p2, player2) },
    }
  };

  const result = rows.map(row => {
    if (firstrow) {
      firstrow = false
      return null;
    }

    var cols = row.split(',');

    const winners = parseTeam(cols[1]);
    const losers = parseTeam(cols[2]);
    const score = cols[3];

    return {
      message: `${winners.player1.displayName} and ${winners.player2.displayName} (group ${winners.groupName}) defeated ${losers.player1.displayName} and ${losers.player2.displayName} (group ${losers.groupName}) by 6-${score}`,
      winners,
      losers,
      score: +score
    }
  }).filter(row => !!row);

  console.log(result);
}


test();