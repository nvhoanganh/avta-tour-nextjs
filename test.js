require("dotenv").config();
const R = require('ramda');
const fetch = require("isomorphic-unfetch");
const csv = require('csvtojson')

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


  const data = `Group,Team,SetWon,SetLost,GameWon,GameLost,Difference
  A,A: Tony Quach + Minh Le,1,0,6,2,4
  B,B: Thang Donvale + Quan Kingsbury,2,1,13,12,1
  B,B: Quan Fed + Luan,2,0,12,5,7
  A,A: TX + TN,1,1,8,6,2
  B,B: Hung Trambo + Luan Rau,0,2,3,12,-9
  B,B: Hoang Anh + Vu Trinh,0,2,7,12,-5`

  const rows = await csv().fromString(data);

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

  const result = rows.map(row => {
    const team = parseTeam(row.Team);

    return {
      ...row,
      ...team
    }
  });

  const groups = R.groupBy((x) => x.Group, result);

  console.log(groups);
}


test();