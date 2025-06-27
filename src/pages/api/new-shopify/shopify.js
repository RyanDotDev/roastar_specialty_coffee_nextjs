// Shopify Storefront API
export async function fetchShopifyData(query, variables = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(process.env.SHOPIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_TOKEN,
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

    return data;
  } catch (error) {
    console.error('Error fetching data from Shopify:', error);
    throw error;
  }
}

// Shopify Admin API
export async function fetchShopifyAdminData(query, variables) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(process.env.SHOPIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if(!response.ok) {
      console.error('Error response:', response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('Shopify Admin API Errors:', errors)
    }

    return data
  } catch (error) {
    console.error('Error fetching data from Shopify Admin API', error);
    throw error;
  }
};