import { sendSms, initFirebase } from '../../lib/backendapi';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


export default async function bulksendsms(req, res) {
  const destinations = req.body.destinations;
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

    // make sure user is superuser
    const docSnap = await db.collection("user_roles").doc(uid).get();
    if (docSnap.exists) {
      const userrole = docSnap.data();
      if (!userrole.superuser) {
        console.error('user is not admin');
        return res.status(401).json({ message: 'User is not admin' })
      }
    } else {
      console.error('user is not admin');
      return res.status(401).json({ message: 'User is not admin' })
    }
  } catch (error) {
    console.error('validate token failed', error);
    return res.status(401).json({ message: 'Invalid Token' })
  }

  try {
    for (let index = 0; index < destinations.length; index++) {
      const { mobile, msg } = destinations[index];
      console.log('sending to ', mobile);
      const sendResult = await sendSms({ body: msg, to: mobile });
      console.log('sms sent', sendResult);
    }

    res.status(200).json({ success: true, sentTo: destinations.length })
    res.end()
  } catch (error) {
    return res.status(500).json({ error })
  }
}
