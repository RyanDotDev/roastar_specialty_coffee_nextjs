import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function syncShopifyProductsToStripe() {
  const response = await fetch(`${process.env.SHOPIFY_URL}/admin/api/2025-10/products.json`, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch Shopify products');
  const data = response.json();

  for (const product of data.products) {
    
    const stripeProduct = await stripe.products.create({
      name: product.title,
      description: product.body.html || '',
      metadata: {
        shopify_product_id: product.id,
      },
    });

    for (const variant of product.variants) {
      await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(variant.price * 100),
        currency: variant.currency || 'usd',
        metadata: {
          shopify_variant_id: variant.id,
        },
      });
    }
  }

  console.log('Shopify products synced to stripe');
}
