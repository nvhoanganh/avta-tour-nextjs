import { sendSms, initFirebase } from '../../lib/backendapi';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


export default async function bulksendsms(req, res) {
  const { destinations } = req.body;

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

    // const sendResult = await sendSms(msg);

    res.status(200).json({ success: true, sentTo: destinations.length })
    res.end()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
