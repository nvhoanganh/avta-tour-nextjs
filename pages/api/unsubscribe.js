import { sendSms, initFirebase } from '../../lib/backendapi';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


export default async function unsubscribe(req, res) {

  const { uid } = req.query;

  try {
    initFirebase();
    const auth = getAuth();
    const db = getFirestore();

    await db.collection("unsubscribed").doc(uid).set({ unsubscribeDate: (new Date()) })
    res.end(`Thanks, you have successfully unsubscribed from AVTA. You can revert this setting at https://avtatour.com/editmyprofile`)
    return;
  } catch (error) {
    console.log("🚀 ~ file: unsubscribe.js ~ line 22 ~ unsubscribe ~ error", error)
    res.end(`Oops! Something went wrong. Please contact your administrator`)
  }
}
