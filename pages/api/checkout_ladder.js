const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { playerId, ladder, fee } = req.query;
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // todo: replace with price value
            price: fee,
            quantity: 1,
          },
        ],
        metadata: {
          playerId, ladder
        },
        mode: 'payment',
        success_url: `${req.headers.origin}/ladders/${ladder}/postpayment?success=true&session_id={CHECKOUT_SESSION_ID}&playerId=${playerId}`,
        cancel_url: `${req.headers.origin}/ladders/${ladder}/postpayment?canceled=true&session_id={CHECKOUT_SESSION_ID}&playerId=${playerId}`,
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