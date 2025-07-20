import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function fetchVariantWeight(variantId) {
  const res = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/variants/${variantId}.json`, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch variant ${variantId}: ${await res.text()}`);
  }

  const data = await res.json();
  return {
    weight: data.variant.grams,
    weight_unit: data.variant.weight_unit
  };
}

export async function createShopifyOrder(paymentIntentId) {
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['charges']
  });
  const metadata = intent.metadata || {};

  // For fetching card details
  const charges = await stripe.charges.list({
    payment_intent: paymentIntentId,
    limit: 1,
  });

  const charge = charges.data[0];
  const card = charge?.payment_method_details?.card;
  const cardholderName = charge?.billing_details?.name;
  const nameOnCard = metadata.name_on_card;

  if (!metadata.cart || !metadata.shipping || !metadata.customer_email) {
    throw new Error('Missing metadata from Payment Intent')
  }

  const cartToken = metadata.cart_token;
  if (cartToken) {
    const existingOrderRes = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/orders.json?financial_status=paid&fields=id,note`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      }
    });

    const existingOrders = (await existingOrderRes.json())?.orders || [];
    const orderExists = existingOrders.some(order => order.note?.includes(cartToken));

    if (orderExists) {
      console.log(`⚠️ Shopify order already exists for cart_token: ${cartToken}`)
      return
    }
  }

  let cartItems, shipping, billing;

  try {
    cartItems = JSON.parse(metadata.cart);
    shipping = JSON.parse(metadata.shipping);
    billing = JSON.parse(metadata.billing);
  } catch (err) {
    throw new Error('Invalid JSON in PaymentIntent metadata: ' + err.message);
  }

  const email = metadata.customer_email;

  let totalWeight = 0;
  const processedLineItems = [];

  for (const item of cartItems) {
    const isCustom = !item.variant_id;

    if (isCustom) {
      processedLineItems.push({
        title: item.title || 'Custom Product',
        price: parseFloat(item.price?.toFixed?.(2)) || item.price || 0,
        quantity: item.quantity,
        custom: true,
      });
      continue;
    }

    const parsedVariantId = item.variant_id.replace('gid://shopify/ProductVariant/', '');
    const { weight: grams } = await fetchVariantWeight(parsedVariantId);

    totalWeight += grams * item.quantity;

    processedLineItems.push({
      variant_id: parsedVariantId,
      quantity: item.quantity,
      grams,
    })
  }

  const shippingLine = {
    title: 'Standard',
    price: 599 / 100, // This was showing as £599 because you need to divide it by 100
    code: 'Standard',
    source: 'Custom'
  }

  const authorisedAmount = parseFloat(((intent.amount_received || intent.amount || 0) / 100).toFixed(2)) + parseFloat((shippingLine.price || 0).toFixed(2));

  // First and Last Name for billing address
  const [first, ...rest] = (shipping.name || '').split(' ');

  // Billing address logic
  let billing_address;

  const [billingFirst, ...billingRest] = (billing.name || '').split(' ');
  billing_address = {
    first_name: billingFirst || '',
    last_name: billingRest.join(' ') || '',
    address1: billing.address.line1 || '',
    address2: billing.address.line2 || '',
    city: billing.address.city || '',
    province: billing.address.state || '',
    country: billing.address.country || '',
    zip: billing.address.postal_code || '',
  }
  

  const orderData = {
    order: {
      line_items: processedLineItems,
      email,
      shipping_address: {
        first_name: first || '',
        last_name: rest.join(' ') || '',
        address1: shipping.address.line1 || '',
        address2: shipping.address.line2 || '',
        city: shipping.address.city || '',
        province: shipping.address.state || '',
        country: shipping.address.country || '',
        zip: shipping.address.postal_code || '',
      },
      billing_address,
      nameOnCard,
      financial_status: 'paid',
      payment_gateway_names: ["stripe"],
      transactions: [
        {
          kind: "authorization", // or "sale" depending on status
          status: "success",
          amount: authorisedAmount,
          gateway: "manual",
          currency: intent.currency,
          processed_at: new Date(intent.created * 1000).toISOString(),
          receipt: {
            card_last4: card?.last4 || '',
            cardholder_name: cardholderName || '',
            card_brand: card?.brand || ''
          }
         }
      ],
      processing_method: 'offsite',
      inventory_management: 'shopify',
      inventory_policy: 'deny',
      shipping_lines: [shippingLine],
      note: cartToken ? 
        `cart_token: ${cartToken} | 
         Card: ${card?.brand?.toUpperCase() || 'Unknown'} •••• ${card?.last4 || 'XXXX'} | 
         Name on card: ${nameOnCard}`
        : undefined
    },
  };

  console.log('[Order Payload]', JSON.stringify(processedLineItems, null, 2));
  console.log('→ Creating Shopify order with shipping:', shipping);
  console.log('→ Creating Shopify order with billing:', billing);
  console.log('→ Order payload shipping_address object:', JSON.stringify(orderData.order.shipping_address, null, 2));
  console.log('→ Order payload billing_address object:', JSON.stringify(orderData.order.billing_address, null, 2));

  const response = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Shopify order creation failed: ${err}`)
  }

  const responseData = await response.json();
  const order = responseData.order;

  console.log('[Shopify Order Response]', JSON.stringify(responseData, null, 2));
  console.log('--- Shopify Order Debug Info ---');
  console.log('financial_status:', order.financial_status);
  console.log('payment_gateway_names:', order.payment_gateway_names);
  console.log('transactions:', JSON.stringify(order.transactions, null, 2));
  console.log('confirmed:', order.confirmed);
  console.log('processed_at:', order.processed_at);
  console.log('fulfillment_status:', order.fulfillment_status);
  console.log('cancelled_at:', order.cancelled_at);
  console.log('created_at:', order.created_at);
  console.log('updated_at:', order.updated_at);
  console.log('tags:', order.tags);
  console.log('note:', order.note);
  console.log('--------------------------------');

  return order.name;
};
