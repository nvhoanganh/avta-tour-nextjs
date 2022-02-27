const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { applicationId, competition } = req.query;
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: process.env.STRIPE_PRICE,
            quantity: 1,
          },
        ],
        metadata: {
          applicationId
        },
        mode: 'payment',
        success_url: `${req.headers.origin}/competitions/${competition}/postpayment?success=true&session_id={CHECKOUT_SESSION_ID}&applicationId=${applicationId}`,
        cancel_url: `${req.headers.origin}/competitions/${competition}/postpayment?canceled=true&session_id={CHECKOUT_SESSION_ID}&applicationId=${applicationId}`,
        automatic_tax: { enabled: true },
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}