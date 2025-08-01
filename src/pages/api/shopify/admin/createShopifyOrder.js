import Stripe from "stripe";
import { fetchDeliveryMethods } from "./deliveryMethods";

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

  const deliveryMethods = await fetchDeliveryMethods();
  console.log('[deliveryMethods]', deliveryMethods);

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

  // Extract metadata as separate keys inside of hasCartItems variable to avoid Stripe 500 lines limit error
  const hasCartItems = Object.keys(metadata).some((key) => key.startsWith('cart_item_')); 

  if ((!hasCartItems && !metadata.product) || !metadata.shipping || !metadata.customer_email) {
    throw new Error('Missing metadata from Payment Intent')
  }

  const cartToken = metadata.cart_token; // cart token checkout metadata 
  const productToken = metadata.product_token; // single product checkout metadata

  if (cartToken && productToken) {
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

  // Checkout metadata extraction
  let cartItems = [];
  let product = null;
  let shipping, billing;

  try {
    shipping = JSON.parse(metadata.shipping);
    billing = JSON.parse(metadata.billing);

    const cartEntries = Object.entries(metadata).filter(([key]) => key.startsWith('cart_item_'));

    // Cart (array) metadata for Shopify order creation
    if (cartEntries.length > 0) {
      cartItems = cartEntries.map(([_, value]) => {
        try {
          return JSON.parse(value);
        } catch (err) {
          console.warn('❌ Failed to parse cart item:', value);
         return null;
        }
      }).filter(Boolean);
    }

    // Single product metadata for Shopify order creation
    if (metadata.product) {
      product = JSON.parse(metadata.product);
      console.log('✅ Parsed single product:', product);

      const variantId = product.variantId || product.variant_id;

      if (!variantId || typeof variantId !== 'string') {
        throw new Error('❌ Missing or invalid variant ID in single product metadata');
      }

      const parsedVariantId = variantId.replace('gid://shopify/ProductVariant/', '');
      const { weight: grams } = await fetchVariantWeight(parsedVariantId);
  
      // Merge into a single product object with everything
      product.variant_id = Number(parsedVariantId);
      product.grams = grams;

    // Add enriched product to cartItems
      cartItems = [product];
    }
  } catch (err) {
    throw new Error('Invalid JSON in PaymentIntent metadata: ' + err.message);
  }

  const email = metadata.customer_email; // Extract email metadata

  let totalWeight = 0;
  const processedLineItems = [];

  for (const item of cartItems) {
    console.log('🧾 Line item received:', item);

    let parsedVariantId;

    if (typeof item.variant_id === 'number') {
      parsedVariantId = item.variant_id;
    } else if (typeof item.variant_id === 'string' && item.variant_id.includes('gid://')) {
      parsedVariantId = Number(item.variant_id.replace('gid://shopify/ProductVariant/', ''));
    } else if (typeof item.variantId === 'string' && item.variantId.includes('gid://')) {
      parsedVariantId = Number(item.variantId.replace('gid://shopify/ProductVariant/', ''));
    }

    if (!parsedVariantId || isNaN(parsedVariantId)) {
      console.log('⚠️ Marked as custom because no variant ID found');
      processedLineItems.push({
        title: item.title || 'Custom Product',
        price: parseFloat(item.price?.toFixed?.(2)) || item.price || 0,
        quantity: item.quantity,
        custom: true,
      });
      continue;
    }

    const grams = item.grams ?? (await fetchVariantWeight(parsedVariantId)).weight;
    totalWeight += grams * item.quantity;

    processedLineItems.push({
      variant_id: parsedVariantId,
      quantity: item.quantity,
      grams,
    });
  }

  // Extract shipping_method from metadata
  let shippingMethod // shippingMethod is an array, use '[shippingMethod]' for debugging

  try {
    shippingMethod = JSON.parse(metadata.shipping_method);
  } catch {
    // fallback: treat as string id and find matching delivery method
    shippingMethod = deliveryMethods.find(m => m.id === metadata.shipping_method)
  }

  console.log('Raw shipping_method metadata:', metadata.shipping_method);
  console.log('Parsed shippingMethod:', shippingMethod);
  console.log('Delivery methods:', deliveryMethods);

  console.log('[shippingMethod]', shippingMethod);
  const subtotal = parseFloat(metadata.subtotal || '0');
  const shippingThreshold = metadata.shipping_threshold; // Threshold for free delivery eligibility
  
  let shippingLine

  if (!shippingLine) {
    shippingLine = {
      title: 'Pickup',
      price: 0,
      code: 'pickup',
      source: 'manual',
    };
  }

  if (!shippingMethod) {
    console.warn('Shipping method not found in deliveryMethods:', metadata.shipping_method);
  }

  const fulfillmentMethod = metadata.fulfillment_method;

  if (fulfillmentMethod === 'pickup') {
    shippingLine = {
      title: 'Pickup in store',
      price: 0,
      code: 'pickup',
      source: 'manual'
    }
  } else {
    if (shippingMethod) {
      const isFree = subtotal >= shippingThreshold && shippingMethod.price > 0;
      shippingLine = {
        title: shippingMethod.label,
        price: isFree ? 0 : shippingMethod.price / 100,
        code: shippingMethod.id,
        source: 'Shopify Metafield',
      };
    } else {
      shippingLine = {
        title: 'Standard',
        price: 0,
        code: 'standard',
        source: 'custom'
      };
    }
  }

  // Metadata for pickup location
  const pickupLocation = metadata.pickup_location;

  let parsedPickupLocation;
  if (pickupLocation) {
    try {
      parsedPickupLocation = JSON.parse(pickupLocation);
    } catch (error) {
      console.warn('Failed to parse pickupLoaction from metadata', error.message)
    }
  }
  
  console.log('Parsed pickup location', pickupLocation)

  // Final amount 
  const authorisedAmount = 
    parseFloat(((intent.amount_received || intent.amount || 0) / 100).toFixed(2)) 
    + parseFloat((shippingLine?.price || 0).toFixed(2));

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

  let note = cartToken || productToken
  ? `${cartToken ? `cart-token: ${cartToken}` : `product-token: ${productToken}`} |

    Card: ${card?.brand?.toUpperCase() || 'Unknown'} | •••• ${card?.last4 || 'XXXX'} |

    Name on card: ${nameOnCard}`
  : `
    Card: ${card?.brand?.toUpperCase() || 'Unknown'} | •••• ${card?.last4 || 'XXXX'} |

    Name on card: ${nameOnCard}
  `;

  let tags = [];

  if (fulfillmentMethod === 'pickup') {
    tags.push('Pickup');

    if (parsedPickupLocation) {
      note += ` 
      | Pickup from: ${parsedPickupLocation.name} (${parsedPickupLocation.address})`;
    }
  } else {
    tags.push('Delivery');
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
          kind: "sale",
          status: "success",
          amount: authorisedAmount,
          gateway: "manual",
          currency: intent.currency,
          processed_at: new Date(intent.created * 1000).toISOString(),
          receipt: {
            card_last4: `•••• •••• •••• ${card?.last4}` || '',
            name_on_card: nameOnCard || '',
            cardholder_name: cardholderName || '',
            card_brand: card?.brand || '',
            payment_gateway: 'Stripe',
            paid_amount: authorisedAmount,
          }
         }
      ],
      processing_method: 'offsite',
      inventory_management: 'shopify',
      inventory_policy: 'deny',
      shipping_lines: shippingLine ? [shippingLine] : [],
      note: note || undefined,
      tags: tags.join(', ')
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
