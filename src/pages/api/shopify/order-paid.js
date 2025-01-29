import { verifyShopifyWebhook } from "./route";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const isVerified = verifyShopifyWebhook(req);

      if (!isVerified) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }

      const { orderId, order } = req.body;
      const financial_status = order?.financial_status

      console.log('Received request body:', JSON.stringify(req.body, null, 2));
      console.log('Order ID:', orderId, 'Financial Status:', financial_status);
      if (!orderId || financial_status !== "paid") {
        return res.status(400).json({ error: 'Order is not fully paid' });
      }

      if (financial_status === 'paid' || financial_status === 'pending') {
        console.log(`Order ${orderId} is paid or pending. Clearing cart...`)
        res.status(200).json({ message: 'Payment confirmed and cart cleared' })
      } else {
        console.log(`Order ${orderId} is not paid`)
        return res.status(400).json({ error: `Order ${orderId} is not fully paid or has been voided.` });
      }
      res.status(200).json({ message: 'Webhook handle successfully' });
    } catch(error) {
      console.error('Error handling Shopify webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};