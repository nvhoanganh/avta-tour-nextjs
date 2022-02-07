import { getPreviewPostBySlug } from '../../lib/api';
import { sendSms, initFirebase } from '../../lib/backendapi';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'


export default async function sendsms(req, res) {

  const { mobile } = req.query;

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Access token missing' })
  }

  try {
    initFirebase();
    const auth = getAuth();
    const db = getFirestore();

    const token = req.headers.authorization.split(' ')[1];
    const { uid } = await auth.verifyIdToken(token);

    const otp = Math.floor(100000 + Math.random() * 900000);

    await db.collection("users_otp").doc(uid).set({ otp, issueDate: (new Date()), mobile })

    const msg = { body: `Hi, here is your one-time code. Your code is: ${otp}.`, to: mobile };

    const sendResult = await sendSms(msg);

    res.status(200).json({ userid: uid, sid: sendResult.sid, success: true })
    res.end()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
