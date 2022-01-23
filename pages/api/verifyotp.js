import { getPreviewPostBySlug } from '../../lib/api';
import { sendSms, initFirebase } from '../../lib/backendapi';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'


export default async function verifyotp(req, res) {
  const { otp, playerId } = req.query;
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
    const saved_otp = await db.collection("users_otp").doc(uid).get();

    if (saved_otp.exists) {
      const savedOtp = saved_otp.data();
      if (savedOtp.otp.toString().trim() === otp.toString().trim()) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ message: 'Invalid One Time Password' })
      }
      res.end()
    } else {
      return res.status(401).json({ message: 'No One Time Password found' })
    }
  } catch (error) {
    console.log('Error is is', error);
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
