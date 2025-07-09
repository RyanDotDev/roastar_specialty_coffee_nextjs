import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createLineItem = async (item) => {
  const price = Math.max(1, Math.round(item.price * 100)); // price in pennies
  const quantity = Math.max(1, item.quantity);
  const image = item.image?.src ?? item.image; // [item.image?.src ?? item.image]?.filter((img) => typeof img === 'string')
  
  return {
    price_data: {
      currency: 'gbp',
      unit_amount: price,
      product_data: {
        name: item.productTitle || item.title || 'Unknown Product',
        description: `${`${item.variantName} x ${item.quantity}` || 'Default'}`,
        images: item ? [image] : [],
        metadata: {
          shopify_product_id: item.productId || item.id || 'unknown',
          shopify_variant_id: item.id || 'unknown',
          fallback: 'true'
        },
      },
    },
    quantity
  };
};

// For checking inventory and preventing overselling during and before checkout
async function checkShopifyVariantInventory(variantId, requiredQuantity) {
  const numericId = variantId.replace("gid://shopify/ProductVariant/", "");

  const res = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/variants/${numericId}.json`, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch variant ${numericId} from Shopify`)
  }

  const data = await res.json();
  const available = data?.variant?.inventory_quantity;

  if (available == null) {
    throw new Error(`No inventory_quantity found for variant ${numericId}`)
  }

  if (available < requiredQuantity) {
    throw new Error(`Only ${available} left in stock for variant ${numericId}, but ${requiredQuantity} requested`);
  }

  return true;
}

export async function createCheckoutSession(req, res) {
  const { cart, product, cancelUrl } = req.body;

  const items = cart || (product ? [product] : [])

  if (!items.length) {
    return res.status(400).json({ error: 'No items to checkout' });
  }

  try {
    await Promise.all(items.map(async (item) => {
      const variantId = item.id;
      const quantity = item.quantity || 1;

      if (!variantId) {
        console.warn('⚠️ Skipping inventory check: missing variant ID');
      } else {
        await checkShopifyVariantInventory(variantId, quantity);
      }

      return createLineItem(item);
    }))
    
  } catch (err) {
    console.error('❌ Inventory check failed', err.message);
    return res.status(400).json({ error: err.message });
  }

  try {
    const line_items = await Promise.all(items.map(createLineItem))
    console.log('Line items going to Stripe:', JSON.stringify(line_items, null, 2));
    
    const metadata = {};

    if (cart && Array.isArray(cart)) {
      cart.forEach((variant, index) => {
        const shortId = variant.id.replace("gid://shopify/ProductVariant/", "") || `unknown_${index}`;
        metadata[`variant_${index}_id`] = shortId,
        metadata[`variant_${index}_quantity`] = String(variant.quantity || 1);
        metadata[`variant+${index}_stripe_price_id`] = variant.stripe_price_id || 'unknown';
        metadata[`variant_${index}`] = `${shortId}|${variant.quantity || 1}|${variant.stripe_price_id || 'none'}`;
      });
    } else if (product) {
      const shortId = product.id.replace("gid://shopify/ProductVariant/", "") || 'unknown_product';
      metadata[`variant_0_id`] = shortId;
      metadata[`variant_0_quantity`] = String(product.quantity || 1);
      metadata[`variant_0_stripe_price_id`] = product.stripe_price_id || 'unknown';
      metadata[`variant_0`] = `${shortId}|${product.quantity || 1}|${product.stripe_price_id || 'none'}`
    }
    // For extra saftey avoid stripe character limitations
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      payment_intent_data: {

      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard Shipping',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 599,
              currency: 'gbp',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 }
            },
            metadata: {
              pickup: 'true'
            }
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you/{CHECKOUT_SESSION_ID}`,
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

