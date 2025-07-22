import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false
  },
};

function verifyShopifyWebhook(req, rawBody, secret) {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
  return digest === hmacHeader;
}

async function getVariantInventoryItemId(variantId) {
  const res = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/variants/${variantId}.json`, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch variant ${variantId}`)
  }
  const data = await res.json();
  return data.variant.inventory_item_id;
}

async function adjustInventoryLevel(inventory_item_id, deductQuantity) {
  const res = 
  await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/inventory_levels.json?inventory_item_ids=${inventory_item_id}&location_ids=${process.env.SHOPIFY_LOCATION_ID}`, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json'
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch inventory levels')
  }
  const data = await res.json();
  if (data.inventory_levels.length === 0) {
    throw new Error('Inventory level not found for this item and location');
  };

  const currentAvailable = data.inventory_levels[0].available;
  const newAvailable = currentAvailable - deductQuantity;

  if (newAvailable < 0) {
    throw new Error(`Cannot deduct ${deductQuantity}, only ${currentAvailable} available`)
  }

  const adjustRes = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/inventory_levels/set.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_id: process.env.SHOPIFY_LOCATION_ID,
        inventory_item_id: inventory_item_id,
        available: newAvailable
      }),
  });

  if (!adjustRes) {
    throw new Error('Failed to update inventory level')
  }

  console.log(`Inventory updated for item ${inventory_item_id}: ${currentAvailable} -> ${newAvailable}`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  const rawBody = await new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => resolve(data))
  })

  const valid = verifyShopifyWebhook(req, rawBody, process.env.SHOPIFY_WEBHOOK_KEY);

  if (!valid) {
    return res.status(401).send('Invalid Signature');
  }

  const topic = req.headers['x-shopify-topic'];
  const shop = req.headers['x-shopify-shop-domain'];
  const data = JSON.parse(rawBody);

  console.log(`🔔 Webhook received: ${topic} from ${shop}`)
  console.log(data);

  if (topic === 'orders/create') {
    const lineItems = data.line_items;
    for (const item of lineItems) {
      const variantId = item.variant_id; // numeric ID (e.g. 123456789)
      const quantityPurchased = item.quantity;

      console.log('🧾 Line item variant ID received:', item.variant_id)

      if (!variantId) {
        console.log('No variant ID for this item, skipping inventory adjustment');
        continue
      }

      try {
        const inventoryItemId = await getVariantInventoryItemId(variantId)
        await adjustInventoryLevel(inventoryItemId, quantityPurchased);
      } catch (err) {
        console.error('Error adjusting inventory:', err.message)
      }
    }
  }

  return res.status(200).send('Webhook Received')
}