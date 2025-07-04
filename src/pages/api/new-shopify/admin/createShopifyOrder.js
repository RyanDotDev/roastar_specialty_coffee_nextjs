import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

  const orderData = {
    order: {
      line_items: lineItems.map(item => {
        const metadata = item.price?.metadata || {};
        const productMetadata = item.price?.product?.metadata || {};

        const shopifyVariantId =
          metadata.shopify_variant_id ||
          productMetadata.shopify_variant_id;

        const parsedVariantId = Number(
          shopifyVariantId?.match(/\d+$/)?.[0] ?? NaN
        );
        console.log(`📦 Extracted Shopify Variant ID raw:`, shopifyVariantId);

        const isFallback = metadata.fallback === 'true' && isNaN(parsedVariantId);

        if (!isFallback && isNaN(parsedVariantId)) {
          throw new Error(`❌ Invalid or missing Shopify variant ID for item: ${item.description}`);
        }

        if (isFallback) {
          console.warn(`⚠️ Fallback item detected: ${item.description}`);
          return {
            title: item.description || metadata.title || "Custom Product",
            price: (item.amount_total ?? item.price?.unit_amount ?? 100) / 100,
            quantity: item.quantity,
            custom: true,
          };
        }

        if (!isNaN(parsedVariantId)) {
          console.log('✅ Using variant_id', parsedVariantId, 'for', item.description)
          return {
            variant_id: parsedVariantId,
            quantity: item.quantity,
          };
        }
        throw new Error(`❌ Invalid or missing Shopify variant ID for item: ${item.description}`);
     }),

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
      transactions: [
        {
          kind: 'sale',
          status: 'success',
          amount: session.amount_total / 100,
        },
      ],
      note_attributes: lineItems.map((item, i) => ({
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
      }))
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
