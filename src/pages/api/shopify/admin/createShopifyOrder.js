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

export async function createShopfifyOrder(sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price', 'line_items.data.price.product', 'customer_details'],
  });

  const lineItems = session.line_items?.data;
  const customer = session.customer_details;
  const shipping = customer?.address;

  console.log('[Stripe Session]', JSON.stringify(session, null, 2));

  if (!lineItems || !lineItems.length) {
    throw new Error('No line items found in session');
  }

  if (!customer || !customer.address) {
    throw new Error('No line items found in session');
  }

   if (!shipping) {
    throw new Error('Missing customer shipping details');
  }

  let totalWeight = 0;
  const processedLineItems = [];

  for (const item of lineItems) {
    const metadata = item.price?.product?.metadata || {};
    const shopifyVariantId = metadata.shopify_variant_id || null;

    const parsedVariantId = Number(shopifyVariantId?.match(/\d+$/)?.[0] ?? NaN);
    const isCustom = !shopifyVariantId || isNaN(parsedVariantId);

    if (isCustom) {
      processedLineItems.push({
        title: item.description || 'Custom Product',
        price: (item.amount_total ?? item.price?.unit_amount ?? 100) / 100,
        quantity: item.quantity,
        custom: true,
      })
      continue;
    }

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

  const orderData = {
    order: {
      line_items: processedLineItems,
      email: customer.email,
      shipping_address: {
        first_name: customer.name?.split(' ')[0],
        last_name: customer.name?.split(' ').slice(1).join(' ') || '',
        address1: customer.address.line1,
        address2: customer.address.line2,
        city: customer.address.city,
        province: customer.address.state,
        country: customer.address.country,
        zip: customer.address.postal_code,
      },
      financial_status: 'paid',
      inventory_management: 'shopify',
      inventory_policy: 'deny',
      shipping_lines: [shippingLine],
      transactions: [
        {
          kind: 'sale',
          status: 'success',
          amount: session.amount_total / 100,
        },
      ],
      /* note_attributes: lineItems.map((item, i) => ({
        name: `item-${i + 1}`,
        value: JSON.stringify({
          metadata: {
            shopify_variant_id: item.price?.metadata?.shopify_variant_id || null,
            shopify_variant_title: item.price?.metadata?.variant_title || null,
            shopify_option1: item.price?.metadata?.option1 || null,
            shopify_option2: item.price?.metadata?.option2 || null,
            shopify_option3: item.price?.metadata?.option3 || null,
          },
          image: item.price?.product?.images?.[0] || 'No Image'
        })
      })) */
    },
  };

  console.log('[Order Payload]', JSON.stringify(lineItems, null, 2));

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
  console.log('[Shopify Order Response]', JSON.stringify(responseData, null, 2));
};
