import Stripe from 'stripe'
import { buffer } from 'micro';
import { createShopfifyOrder } from './admin/createShopifyOrder';

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
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const sessionId = event.data.object.id;

    try {
      await createShopfifyOrder(sessionId);
      console.log('✅ Shopify order created');
    } catch (err) {
      console.error('❌ Failed to sync order to Shopify', err.message)
    }
  }

  res.status(200).json({ received: true });
};
