import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createLineItem = async (item) => {
  const price = Math.max(1, Math.round(item.price * 100)); // price in pennies
  const quantity = Math.max(1, item.quantity);
  const image = item.image?.src ?? item.image; // [item.image?.src ?? item.image]?.filter((img) => typeof img === 'string')
  
  return {
    price,
    quantity,
    name: item.productTitle || item.title || 'Unknown Product',
    description: `${item.variantName ?? ''} x ${quantity}`,
    image,
    productId: item.productId || item.id,
    variantId: item.id,
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

export async function createPaymentIntentSession(req, res) {
  const { cart, cartToken, product, fulfillmentMethod, pickupLocation } = req.body;

  const items = cart || (product ? [product] : [])
  if (!items.length) return res.status(400).json({ error: 'No items to checkout' });

  try {
    // Inventory check
    await Promise.all(items.map(async (item) => {
      const variantId = item.id;
      const quantity = item.quantity || 1;

      if (variantId) {
        await checkShopifyVariantInventory(variantId, quantity);
      }
    }))

    // Build line items and calculates total
    const lineItems = await Promise.all(items.map(createLineItem));
    const totalAmount = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Shipping fee (if any)
    let shippingAmount = 0;
    if (fulfillmentMethod === 'shipping') {
      const FREE_SHIPPING_THRESHOLD = 2500;
      const SHIPPING_FEE = 599;

      if (totalAmount < FREE_SHIPPING_THRESHOLD) {
        shippingAmount = SHIPPING_FEE;
      }
    }

    const amount = totalAmount + shippingAmount;

    const metadata = {
      ...(cartToken && { cart_token: cartToken }),
      ...(cart && { cart: JSON.stringify(cart) }),
      ...(req.body.shipping && { shipping: JSON.stringify(req.body.shipping) }), 
      ...(req.body.email && { customer_email: req.body.email }),
      fulfillment_method: fulfillmentMethod || 'shipping',
      ...(pickupLocation && fulfillmentMethod === 'pickup' && {
      pickup_location: pickupLocation
      }),
    };

    if (pickupLocation && fulfillmentMethod === 'pickup') {
      metadata.pickup_location = pickupLocation;
    }

    if (shippingAmount > 0) {
      metadata.shipping_fee = shippingAmount.toString(); // Add shipping fee to metadata
    }

    lineItems.forEach((item, index) => {
      const shortId = item.variantId?.replace("gid://shopify/ProductVariant/", "") || `unknown_${index}`;
      metadata[`item_${index}`] = `${shortId}|${item.quantity}`;
    });

    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.shipping?.name,
      shipping: req.body.shipping,
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp',
      payment_method_types: ['card'],
      receipt_email: req.body.email,
      shipping: req.body.shipping || undefined,
      metadata,
      customer: customer.id, 
      automatic_payment_methods: {
        enabled: false,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount,
      currency: 'gbp',
      shippingAmount
    });
  } catch (err) {
    console.error('❌ Inventory check failed', err.message);
    return res.status(400).json({ error: err.message });
  }
};

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  };
  return createPaymentIntentSession(req, res)
};

