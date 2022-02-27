import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'

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
    } : player
  });
}