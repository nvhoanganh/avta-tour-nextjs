import { initFirebase } from '../../lib/backendapi';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Access token missing' })
  }

  try {
    console.log(`Serverless: revalidating path`, req.query.path);
    initFirebase();
    const auth = getAuth();
    const db = getFirestore();
    const token = req.headers.authorization.split(' ')[1];
    const { uid } = await auth.verifyIdToken(token);

    await res.unstable_revalidate(req.query.path)
    console.log(`Serverless: revalidating path - DONE`, req.query.path);

    return res.json({ revalidated: true, path: req.query.path })
  } catch (err) {
    console.log('Error revalidating path', err)
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}