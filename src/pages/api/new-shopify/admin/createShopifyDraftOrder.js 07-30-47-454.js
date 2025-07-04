export async function createShopifyDraftOrder(items, customerEmail) {
  const draftOrder = {
    draft_order: {
      line_items: items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      email: customerEmail,
      currency: 'GBP',
      note: 'Draft order created during checkout process',
      tags: 'Stripe Checkout',
    },
  };

  const response = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-04/draft_orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
    },
    body: JSON.stringify(draftOrder),
  });

  if(!response.ok) {
    const err = await response.text();
    console.error('Failed to create draft order:', err);
    throw new Error('Shopify draft order creation failed')
  };

  const data = await response.json();
  return data.draft_order;
};
