import { getPreviewPostBySlug } from '../../lib/api';
import { sendSms, initFirebase } from '../../lib/backendapi';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'


export default async function sendsms(req, res) {
  const { authorization } = req.headers;

  // if (!authorization) {
  //   return res.status(401).json({ message: 'Access token missing' })
  // }

  try {
    initFirebase();
    const auth = getAuth();
    const db = getFirestore();

    const data = await db.collection("ladder_results").get();
    data.docs.forEach(async x => {
      const d = x.data();
      const newD = {
        ...d,
        loserUser1: {
          uid: d.loserUser1.uid
        },
        loserUser2: {
          uid: d.loserUser2.uid
        },
        winnerUser1: {
          uid: d.winnerUser1.uid
        },
        winnerUser2: {
          uid: d.winnerUser2.uid
        },
      };

      await db.collection("ladder_results").doc(x.id).set(newD)
      console.log("Updated - ", newD, x.id)
    });


    res.status(200).json({ done: true })
    res.end()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
