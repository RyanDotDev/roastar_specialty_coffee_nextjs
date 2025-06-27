import { registerOrderWebhook } from "./webhook";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const webhook = await registerOrderWebhook("");
    res.status(200).json({ success: true, webhook });
  } catch (error) {
    console.error("Failed to register webhook:", error);
    res.status(500).json({ error: error.message });
  }
}