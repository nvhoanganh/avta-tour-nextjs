import { getPreviewPostBySlug } from '../../lib/api';
import { sendSms } from '../../lib/backendapi';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'


export default async function sendsms(req, res) {
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

  const { mobile } = req.query;

  const { authorization } = req.headers;

  const auth = getAuth();
  const db = getFirestore();

  if (!authorization) {
    return res.status(401).json({ message: 'Access token missing' })
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('checking token: ' + token);
    const { uid } = await auth.verifyIdToken(token);

    console.log('token valid, user id is ' + uid);
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('6 digit number is' + uid);

    await db.collection("users_otp").doc(uid).set({ otp, issueDate: (new Date()), mobile })

    const msg = { body: `Hi, here is your one-time code. Your code is: ${otp}.`, to: mobile };
    console.log('Sending', msg);

    // store in firestore
    res.status(200).json({ mobile, userid: uid })
    res.end()
  } catch (error) {
    console.log('Error is is', error);
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
