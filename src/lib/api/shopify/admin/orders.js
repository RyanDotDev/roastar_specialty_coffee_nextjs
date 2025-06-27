import { verifyShopifyWebhook } from '@/pages/api/new-shopify/admin/shopify';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { isValid, rawBody } = await verifyShopifyWebhook(req, process.env.SHOPIFY_WEBHOOK_SECRET);

  if (!isValid) return res.status(401).send("Unauthorized");

  const orderData = JSON.parse(rawBody.toString());
  const customerEmail = orderData.email;

  // Example: Save flag in your database, KV store, etc.
  console.log(`Order received for customer: ${customerEmail}`);

  res.status(200).send("Order webhook received");
}