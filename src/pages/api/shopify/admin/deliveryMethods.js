export async function fetchDeliveryMethods() {
  const query = `
    {
      shop {
        metafield(namespace: "shipping", key: "methods") {
          value
        }
        shipping: metafield(namespace: "shipping", key: "threshold") {
          value
        }
      }
    }
  `;

  const response = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();

  return {
    deliveryMethods: JSON.parse(data.shop.metafield.value),
    shippingThreshold: parseFloat(data.shop.shipping.value),
  };
}

export default async function handler(req, res) {
  try {
    const { deliveryMethods, shippingThreshold } = await fetchDeliveryMethods();
    res.status(200).json({ shippingMethods: deliveryMethods, shippingThreshold });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery methods' });
  }
};
