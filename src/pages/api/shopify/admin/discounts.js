export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    console.log('No discount code provided');
    return res.status(400).json({ valid: false, message: 'Missing discount code' });
  }

  try {
    const lookupDiscountRes = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/discount_codes/lookup.json?code?code=${code}`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!lookupDiscountRes.ok) {
      console.log(`Discount code "${code}" not found or invalid`);
      return res.status(404).json({ valid: false, message: 'Code not found or expired' });
    }

    const data = await lookupDiscountRes.json();

    console.log(`Code "${code}" is valid`, {
      discount_code: data.discount_code?.code,
      price_rule_id: data.discount_code?.price_rule_id,
      discount_id: data.discount_code?.id,
    });

    return res.status(200).json({ valid: true, discount: data.discount_code });
  } catch (error) {
    console.error(`Error validating discount code "${code}":`, error);
    return res.status(500).json({ valid: false, message: `Internal error` })
  }
};
