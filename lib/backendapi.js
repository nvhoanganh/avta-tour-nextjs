import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'
import { GetLadderStanding, getAllPlayers } from './api'
import { CleanUser } from './browserapi'
export async function sendSms({ body, to }) {
  const twilio = require('twilio');
  const client = new twilio(process.env.TWILIO_ACCOUNT, process.env.TWILIO_API_KEY);

  const msg = await client.messages
    .create({
      body,
      messagingServiceSid: process.env.TWILIO_MSG_SERVICEID,
      to
    });

  return msg;
}

export async function initFirebase() {
  const apps = getApps();
  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
    console.log(`app ${process.env.FIREBASE_PROJECT} init with email ${process.env.FIREBASE_CLIENT_EMAIL}`);
  }
}

export async function getLinkedUsers() {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("users").where("playerId", "!=", null).get();
  const users = data.docs;
  return users.map(element => {
    return element.data();
  });
}

export async function getCompResults(compId) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("competition_results").where("competitionId", "==", compId)
    .orderBy("timestamp", "desc")
    .get();
  const results = data.docs;
  return results.map(element => {
    let d = element.data();
    d = {
      ...d,
      id: element.id,
      timestamp: d.timestamp.toDate().toISOString(),
    }
    return d;
  });
}

export async function getAppliedTeams(compId) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("competition_applications").where("competitionId", "==", compId)
    .get();

  const results = data.docs;
  return results.map(element => {
    let d = element.data();
    d = {
      ...d,
      id: element.id,
      timestamp: d.timestamp.toDate().toISOString(),
      paidOn: d.paidOn?.toDate()?.toISOString() || null,
    }
    return d;
  });
}

export async function getAppliedTeamsForComps(comps) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("competition_applications").where("competitionId", "in", comps)
    .get();

  const results = data.docs;
  return results.map(element => {
    let d = element.data();
    d = {
      ...d,
      id: element.id,
      timestamp: d.timestamp.toDate().toISOString(),
      paidOn: d.paidOn?.toDate()?.toISOString() || null
    }
    return d;
  });
}

export async function getCompSchedule(compId) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("competition_schedule").doc(compId).get();
  if (data.exists) {
    return data.data();
  }
  return null;
}

export async function getCompGroupsAllocation(compId) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("competition_groups").doc(compId).get();
  if (data.exists) {
    return data.data();
  }
  return null;
}

export async function findLinkedUsers(playerId) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("users").where("playerId", "==", playerId).get();
  if (data.size > 0) {
    return data.docs[0].data();
  }
  return null;
}

export async function mergeUsersAndPlayersData(allPlayers) {
  const allRegisteredUsers = (await getLinkedUsers()) ?? [];
  return allPlayers.map(player => {
    const linkedUser = allRegisteredUsers.find(x => x.playerId === player.sys.id);
    return linkedUser ? {
      ...player,
      ...linkedUser,
      fullName: linkedUser.displayName || player.fullName
    } : player
  });
}

export async function getAllLadders() {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("ladders").get();

  return getItemsAsArray(data);
}

function getItemsAsArray(data) {
  const results = data.docs;
  return results.map(element => {
    let d = element.data();
    return {
      ...d,
      id: element.id,
      ...(d.timestamp && { timestamp: d.timestamp.toDate().toISOString() }),
      ...(d.createdOn && { createdOn: d.createdOn.toDate().toISOString() }),
      ...(d.startDate && { startDate: d.startDate.toDate().toISOString() }),
      ...(d.endDate && { endDate: d.endDate.toDate().toISOString() }),
      ...(d.paidOn && { paidOn: d.paidOn.toDate().toISOString() }),
    }
  });
}

export async function getLadderDetails(id, allUsers) {
  initFirebase();
  const db = getFirestore();
  console.log(`${(new Date()).toISOString()} - get Ladder by ID - Started`);
  const data = await db.collection("ladders").doc(id).get();
  console.log(`${(new Date()).toISOString()} - get Ladder by ID - End`);

  console.log(`${(new Date()).toISOString()} - get Ladder matches - Started`);
  const tonightMatches = await db.collection("ladder_matches").doc(id).get();
  console.log(`${(new Date()).toISOString()} - get Ladder matches - End`);

  if (data.exists) {
    // get players
    const d = data.data();

    console.log(`${(new Date()).toISOString()} - get Ladder results - Started`);
    const scores = await db.collection("ladder_results").where("ladderId", "==", id)
      .orderBy("timestamp", "desc")
      .get();
    console.log(`${(new Date()).toISOString()} - get Ladder results - End`);

    const scores2 = (getItemsAsArray(scores) || []);

    // merge with current users details
    const mergedScores = scores2.map(x => {

      // player could be claimed or not claimed
      const winner1 = allUsers.find(u => u.uid === x.winnerUser1.uid || u.sys.id === x.winner1);
      const winner2 = allUsers.find(u => u.uid === x.winnerUser2.uid || u.sys.id === x.winner2);
      const loser1 = allUsers.find(u => u.uid === x.loserUser1.uid || u.sys.id === x.loser1);
      const loser2 = allUsers.find(u => u.uid === x.loserUser2.uid || u.sys.id === x.loser2);

      // we don't want to keep the
      CleanUser(winner1, 'coverImage,photoURL');
      CleanUser(winner2, 'coverImage,photoURL');
      CleanUser(loser1, 'coverImage,photoURL');
      CleanUser(loser2, 'coverImage,photoURL');

      return {
        ...x,
        winnerUser1: { ...x.winnerUser1, ...winner1 },
        winnerUser2: { ...x.winnerUser2, ...winner2 },
        loserUser1: { ...x.loserUser1, ...loser1 },
        loserUser2: { ...x.loserUser2, ...loser2 },
      }
    });

    // get players - full profile
    const players = await db.collection("ladders").doc(id).collection("players").get();
    let players2 = getItemsAsArray(players) || []
    players2 = players2.map(x => {
      const usr = allUsers.find(u => u.playerId === x.playerId);
      return {
        ...x,
        ...usr,
      }
    });

    return {
      ...d,
      id: data.id,
      timestamp: d.timestamp.toDate().toISOString(),
      startDate: d.startDate?.toDate()?.toISOString() || null,
      endDate: d.endDate?.toDate()?.toISOString() || null,
      // collection
      players: players2,
      scores: mergedScores,
      ...(tonightMatches.exists && { tonightMatches: tonightMatches.data() }),
      ranking: GetLadderStanding(scores2, allUsers)
    };
  }
  return null;
}

export async function getLadderBasicDetails(id, allUsers) {
  initFirebase();
  const db = getFirestore();
  console.log(`${(new Date()).toISOString()} - get Ladder by ID - Started`);
  const data = await db.collection("ladders").doc(id).get();
  console.log(`${(new Date()).toISOString()} - get Ladder by ID - End`);

  if (data.exists) {
    // get players
    const d = data.data();

    // get players - full profile
    const players = await db.collection("ladders").doc(id).collection("players").get();
    let players2 = getItemsAsArray(players) || []
    players2 = players2.map(x => {
      const usr = allUsers.find(u => u.playerId === x.playerId);
      return {
        ...x,
        ...usr,
      }
    });

    return {
      ...d,
      id: data.id,
      timestamp: d.timestamp.toDate().toISOString(),
      startDate: d.startDate?.toDate()?.toISOString() || null,
      endDate: d.endDate?.toDate()?.toISOString() || null,
      players: players2,
    };
  }
  return null;
}

export const GetMergedPlayersWithNoAvatar = async () => {
  console.log(`${(new Date()).toISOString()} - Get data from Contentful started`);
  let allPlayers = (await getAllPlayers(false)) ?? [];
  allPlayers = await mergeUsersAndPlayersData(allPlayers);
  allPlayers = allPlayers.map(x => {
    CleanUser(x, 'coverImage,photoURL,aboutMe')
    return x;
  });
  console.log(`${(new Date()).toISOString()} - Get data from Contentful done`);

  return allPlayers;
}