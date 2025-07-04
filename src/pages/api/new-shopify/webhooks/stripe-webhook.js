import Stripe from 'stripe'
import { buffer } from 'micro';
import { createShopfifyOrder } from '../admin/createShopifyOrder';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const buff = await buffer(req);
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buff.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    console.error('❌ Stripe webhook signature failed', err);
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;

      
    try {
      await createShopfifyOrder(sessionId);
      console.log('✅ Shopify order created for session', sessionId);
      return res.status(200).json({ received: true })
    } catch (err) {
      console.error('Error creating Shopify order:', err);
      return res.status(500).send('Shopify order creation failed');
    }
  } 

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    console.log('Charge succeeded for customers', charge.customer)
  }

  res.status(200).json({ received: true });
};
