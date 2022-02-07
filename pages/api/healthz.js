import { getPreviewPostBySlug } from '../../lib/api';
import { sendSms, initFirebase } from '../../lib/backendapi';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'


export default async function healthz(req, res) {
  try {
    initFirebase();
    const auth = getAuth();
    const db = getFirestore();

    const users = await (await db.collection("users").get()).docs;
    res.status(200).json({ userCount: users.length})
    res.end()
  } catch (error) {
    return res.status(400).json({ error })
  }
}
