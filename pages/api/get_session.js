const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);
    res.status(200).json({ success: true, customer })
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}