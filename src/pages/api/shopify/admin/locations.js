// Async function for fetching Shopify store locations
export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/locations.json`, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify Admin API response error:', response.status, errorText);
      return res.status(500).json({
        error: 'Failed to fetch locations from Shopify',
        status: response.status,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data.locations);
  } catch (error) {
    console.error('Shopify Admin API error (network or runtime):', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
