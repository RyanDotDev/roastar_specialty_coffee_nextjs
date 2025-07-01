import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  const { cart, product, cancelUrl } = req.body;

  const items = cart || (product ? [product] : [])

  if (!items.length) {
    return res.status(400).json({ error: 'No items to checkout' });
  }

  try {
    const line_items = items.map((item) => ({
      price: item.stripe_discounted_price_id || item.stripe_price_id,
      quantity: item.quantity,
    }));
    console.log('Line items going to Stripe:', line_items);
    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard Shipping',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500,
              currency: 'gbp',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 }
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        cart: JSON.stringify(cart)
      }
    });

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    return res.status(500).json({ error: 'Unable to create checkout session' });
  };
};

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  };
  return createCheckoutSession(req, res)
};

