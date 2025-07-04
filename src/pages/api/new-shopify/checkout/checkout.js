import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const validateStripePriceId = async (priceId) => {
  try {
    const price = await stripe.prices.retrieve(priceId);
    const product = await stripe.products.retrieve(price.product)

    if (price.active && product.active) {
      return true;
    } else {
      console.warn(`⚠️ Stripe Price or Product is inactive ${priceId}`)
      return false;
    }
  } catch (err) {
    console.warn(`⚠️ Failed to fetch or validate Stripe Price ID ${priceId}:`, err.message);
    return false;
  }
}

const createLineItem = async (item) => {
  const stripePriceId = 
    item.stripe_discounted_price_id ||
    item.stripe_price_id ||
    item.metafields?.stripe_price_id;

    if (stripePriceId && await validateStripePriceId(stripePriceId)) {
      return {
        price: stripePriceId,
        quantity: item.quantity,
      };
    } else {
      console.warn(`⚠️ Missing or incorrect Stripe Price ID for item: ${item.id || item.title}`);

      return {
        price_data: {
          currency: 'gbp',
          unit_amount: Math.max(1, Math.round(item.price * 100)),
          product_data: {
            name: item.productTitle || item.title || 'Unknown Product',
            description: `${`${item.variantName} x ${item.quantity}` || 'Default'}`,
            images: [item.image?.src || item.image]?.filter(Boolean),
            metadata: {
              shopify_product_id: item.productId || item.id || 'unknown',
              shopify_variant_id: item.id || 'unknown',
              fallback: 'true'
            },
          },
        },
        quantity: Math.max(1, item.quantity)
      }
    }
}

export async function createCheckoutSession(req, res) {
  const { cart, product, cancelUrl } = req.body;

  const items = cart || (product ? [product] : [])

  if (!items.length) {
    return res.status(400).json({ error: 'No items to checkout' });
  }

  try {
    const line_items = await Promise.all(items.map(createLineItem))
    console.log('Line items going to Stripe:', JSON.stringify(line_items, null, 2));
    
    const metadata = {};
    cart.forEach((variant, index) => {
      metadata[`variant_${index}_id`] = variant.id.replace("gid://shopify/ProductVariant/", "");
      metadata[`variant_${index}_quantity`] = String(variant.quantity);
      metadata[`variant+${index}_stripe_price_id`] = variant.stripe_price_id;
    })

    // For extra saftey avoid stripe character limitations
    cart.forEach((variant, index) => {
      const shortId = variant.id.replace("gid://shopify/ProductVariant/", "");
      metadata[`variant_${index}`] = `${shortId}|${variant.quantity}|${variant.stripe_price_id}`;
    });

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
      metadata,
    });

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        session_id: session.id,
      }
    })

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

