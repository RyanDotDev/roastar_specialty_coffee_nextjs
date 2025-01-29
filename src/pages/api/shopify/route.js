import { LRUCache } from "lru-cache";
import crypto from 'crypto';
import { buffer } from 'micro';

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 10,
})

export const verifyShopifyWebhook = async (req) => {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];

  const rawBody = await buffer(req);
  console.log("Raw body:", rawBody.toString('utf8'));

  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  const generatedHMAC = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('base64');

    console.log("Generated HMAC:", generatedHMAC);  // Log to check if it's being generated properly
    console.log("Received HMAC:", hmacHeader);

  return hmacHeader === generatedHMAC;
};

export async function fetchShopifyData(query, variables = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000)
  const cacheKey = JSON.stringify({ query, variables })

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  try {
    const response = await fetch(process.env.SHOPIFY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SHOPIFY_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_API_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error('Error response:', response);  // Log error responses
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data } = await response.json();
    if (data.errors) {
      console.error('Shopify GraphQL Errors:', data.errors);
    }

    // cache the response
    cache.set(cacheKey, data)

    return data;
  } catch (error) {
    console.error('Error fetching data from Shopify:', error);
    throw error;
  }
}