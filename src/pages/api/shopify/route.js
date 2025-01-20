import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 10,
})

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