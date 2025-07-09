import { fetchShopifyData } from "@/pages/api/shopify/shopify";

export default async function createCheckout(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    const { lineItems } = req.body;
    const variables = {
      input: {
        lines: lineItems.map((item) => ({
          merchandiseId: item.merchandiseId,
          quantity: item.quantity,
        }))
      }
    }
    const query = `
      mutation cartCreate($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await fetchShopifyData(query, variables);
    const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
    const orderId = data?.cartCreate?.cart?.id;

    if (!checkoutUrl || !orderId) {
      throw new Error("Failed to create checkout")
    }

    res.status(200).json({ checkoutUrl, orderId })
  } catch(error) {
    console.error("Error in createCheckout API route:", error);
    res.status(500).json({ error: error.message || 'Failed to create checkout' });
  }
};