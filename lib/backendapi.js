import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'
import { GetLadderStanding, getAllPlayers } from './api'
import { CleanUser } from './browserapi';
import { head, uniq, replace, forEach } from 'ramda'
import { last, prop, sortBy, takeLast } from "ramda";
import { differenceInDays, differenceInMonths } from "date-fns";
import { format } from 'date-fns'

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

export async function getCompsRegistrationSummary(allPlayers) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("competition_applications").get();
  const compApplications = data.docs;
  const compsReg = compApplications.map(element => {
    return element.data();
  });

  const sortByCompDate = sortBy(prop('comDate'));

  return allPlayers.reduce((pre, cur) => {
    const playerId = cur.sys.id;
    const compsPlayed = compsReg
      .filter(x => x.player1.sys.id === playerId || x.player2.sys.id === playerId)
      .map(x => ({
        competitionId: x.competitionId,
        title: x.title,
        maxPoint: x.maxPoint,
        comDate: x.compDate,
        slug: x.slug
      }));
    const sortedcomps = sortByCompDate(compsPlayed);
    cur.competitions = sortedcomps;
    cur.compsPlayed = sortedcomps.length;
    cur.lastComp = sortedcomps.length > 0 ? last(cur.competitions) : null;
    cur.monthsSinceLastComp = sortedcomps.length > 0 ? differenceInMonths(new Date(), new Date(last(sortedcomps).comDate)) : null;

    if (sortedcomps.length > 1) {
      const last2 = takeLast(2, sortedcomps);
      if (format(new Date(last2[0].comDate), 'dd/MM/yyyy') === format(new Date(last2[1].comDate), 'dd/MM/yyyy')) {
        cur.lastComp2 = last2[0];
      }
    }
    pre.push(cur);
    return pre;
  }, []);
}

export async function getPlayersNotInContentful() {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("users")
    .where("notInContentful", "==", true)
    .get();
  const users = data.docs;
  return users.map(element => {
    return { ...element.data(), sys: { id: element.data().uid } };
  }).filter(x => !x.playerId);
}

export async function getGeoLocatedClubs() {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("clubs").get();
  const users = data.docs;
  return users.map(element => {
    return { ...element.data(), id: element.id };
  });
}

export async function addGeolocatedClub(club) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("clubs").add(club);
}

export async function updateClub(club) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("clubs").doc(club.id).set(club);
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
    .orderBy("timestamp", "desc")
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

  const data = await db.collection("competition_applications").where("competitionId", "in", comps.slice(0, 10))
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

export async function getCompGroupsAllocation(compId, appliedTeams) {
  initFirebase();
  const db = getFirestore();
  const getTeamById = id => appliedTeams?.filter(team => team.id === id)[0];
  const data = await db.collection("competition_groups").doc(compId).get();
  if (data.exists) {
    const groups = data.data();
    const toReturn = Object.keys(groups).reduce((pre, cur) => {
      return {
        ...pre,
        [cur]: groups[cur].map(x => ({
          ...x,
          ...getTeamById(x.id)
        }))
      }
    }, {});
    return toReturn;
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

export async function findUserByUid(uid) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("users").where("uid", "==", uid).get();
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

export async function mergeUsersAndRegisteredPlayers(allPlayers, allRegisteredUsers) {
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

  const toreturn = getItemsAsArray(data);
  return toreturn.sort((a, b) => {
    if (new Date(a.endDate) < new Date(b.endDate)) return 1;
    return -1;
  });
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
      ...(d.paidOn && { paidOn: d.paidOn?.toDate()?.toISOString() }),
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
    const ladderDetails = data.data();

    console.log(`${(new Date()).toISOString()} - get Ladder results - Started`);
    const scores = await db.collection("ladder_results").where("ladderId", "==", id)
      .orderBy("timestamp", "desc")
      .get();
    console.log(`${(new Date()).toISOString()} - get Ladder results - End`);

    const scores2 = (getItemsAsArray(scores) || []);

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

    const playersWithCustomPoints = allUsers.map(x => {
      const playerWithLadderPoint = players2.filter(p => p.playerId === x.uid && !!p.ladderPoint);
      if (playerWithLadderPoint.length > 0) {
        return {
          ...x,
          avtaPoint: playerWithLadderPoint[0].ladderPoint,
          hasLadderPoint: true
        }
      }
      return x;
    });

    // merge with current users details
    const mergedScores = scores2.map(x => {

      // player could be claimed or not claimed
      const winner1 = playersWithCustomPoints.find(u => u.uid === x.winnerUser1.uid || u.sys.id === x.winner1);
      const winner2 = playersWithCustomPoints.find(u => u.uid === x.winnerUser2.uid || u.sys.id === x.winner2);
      const loser1 = playersWithCustomPoints.find(u => u.uid === x.loserUser1.uid || u.sys.id === x.loser1);
      const loser2 = playersWithCustomPoints.find(u => u.uid === x.loserUser2.uid || u.sys.id === x.loser2);

      return {
        ...x,
        winnerUser1: { ...x.winnerUser1, ...winner1 },
        winnerUser2: { ...x.winnerUser2, ...winner2 },
        loserUser1: { ...x.loserUser1, ...loser1 },
        loserUser2: { ...x.loserUser2, ...loser2 },
      }
    });


    return {
      ...ladderDetails,
      id: data.id,
      timestamp: ladderDetails.timestamp.toDate().toISOString(),
      startDate: ladderDetails.startDate?.toDate()?.toISOString() || null,
      endDate: ladderDetails.endDate?.toDate()?.toISOString() || null,
      // collection
      players: players2,
      scores: mergedScores,
      ...(tonightMatches.exists && { tonightMatches: tonightMatches.data() }),
      ranking: GetLadderStanding(scores2, playersWithCustomPoints, ladderDetails)
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

export async function getLadderDetailsOnly(id) {
  initFirebase();
  const db = getFirestore();
  const data = await db.collection("ladders").doc(id).get();

  if (data.exists) {
    // get players
    const d = data.data();

    return {
      ...d,
      id: data.id,
      timestamp: d.timestamp.toDate().toISOString(),
      startDate: d.startDate?.toDate()?.toISOString() || null,
      endDate: d.endDate?.toDate()?.toISOString() || null,
    };
  }
  return null;
}

export const GetMergedPlayers = async () => {
  let allPlayers = (await getAllPlayers(false)) ?? [];
  allPlayers = await mergeUsersAndPlayersData(allPlayers);

  const playersNotInContentful = await getPlayersNotInContentful();
  allPlayers = allPlayers.concat(playersNotInContentful);
  return allPlayers;
}

const geoLookup = async (address) => {
  const longlat = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCtYkMYs3wXrH_y5XjmiAZNd2UrjslujcA`
  ).then((response) => response.json());

  if (longlat?.results?.length > 0) {
    return longlat?.results[0].geometry?.location
  }
  return {};
}

export const CheckAndUpdateClub = async (players) => {
  const cleanName = (n) => {
    let hc = (n || '').toLowerCase();
    let d = replace(' tc', '', hc);
    d = replace(' t/c', '', d);
    d = replace(' tennis club', '', d);
    return d.trim();
  }

  const countPlayers = (n) => {
    return players.filter(p => p?.homeClub?.toLowerCase()?.indexOf(n) >= 0).length;
  }

  const countPlayersCanMarkScore = (n) => {
    return players.filter(p => p?.homeClub?.toLowerCase()?.indexOf(n) >= 0 && p?.canMarkScore).length;
  }

  const clubs = uniq(players.map(x => cleanName(x.homeClub))).filter(x => !!x);

  const allClubs = await getGeoLocatedClubs();
  clubs.forEach(async club => {
    const foundList = allClubs.filter(x => x.name === club);
    const playersCount = countPlayers(club);
    const markersCount = countPlayersCanMarkScore(club);

    if (foundList.length === 1 && (
      foundList[0].playersCount !== playersCount ||
      foundList[0].markersCount !== markersCount
    )) {
      const toUpdate = { ...foundList[0], playersCount, markersCount };
      await updateClub(toUpdate);
    } else if (foundList.length === 0) {
      const longlat = await geoLookup(`${club} Tennis Club, Australia`);
      console.log('adding club', club, longlat);
      await addGeolocatedClub({ name: club, ...longlat, playersCount });
    }
  });

  return await getGeoLocatedClubs();
}