export async function fetchShopifyData(query, variables = {}) {
  try {
    const response = await fetch(process.env.SHOPIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_API_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
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