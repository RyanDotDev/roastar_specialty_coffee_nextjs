export default async function handler(req, res) {
  try {
    const query = `
      {
        shop {
          metafield(namespace: "shipping", key: "methods") {
            value
            type
          }
        }
      }
    `;

    const response = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query }),
    })

    const { data } = await response.json();

    const methods = JSON.parse(data.shop.metafield.value);
    res.status(200).json({ deliveryMethods: methods });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery methods' });
  }
};
