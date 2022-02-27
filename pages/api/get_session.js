const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { getFirestore, CollectionReference } from 'firebase-admin/firestore'
import { initFirebase } from '../../lib/backendapi';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log(session);
    const customer = await stripe.customers.retrieve(session.customer);

    initFirebase();
    const db = getFirestore();

    await db.collection("competition_applications")
      .doc(session.metadata.applicationId)
      .update({
        paidOn: (new Date()),
        amount_paid: session.amount_total,
        payment_intent: session.payment_intent,
      })

    res.status(200).json({
      success: true,
      ...session,
      customer,
    })
  } catch (err) {
    console.log('error: ' + err);
    res.status(err.statusCode || 500).json(err.message);
  }
}