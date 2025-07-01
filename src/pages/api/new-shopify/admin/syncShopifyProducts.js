import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch error: ${res.status} ${text}`);
  }
  return res.json();
}

// Delays reponses to adhere Stripes fetch limits
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncShopifyProductsToStripe() {
  const shopifyUrl = process.env.SHOPIFY_URL;
  const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

  // Get all Shopify products (with needed fields)
  const { products } = await fetchJson(
    `${shopifyUrl}/admin/api/2025-04/products.json?fields=id,title,variants,image`,
    {
      headers: {
        "X-Shopify-Access-Token": adminToken,
        "Content-Type": "application/json",
      },
    }
  );

  for (const product of products) {
    // 2. Fetch metafields for the product (returns array of metafields)
    const { metafields: productMetafields } = await fetchJson(
      `${shopifyUrl}/admin/api/2025-04/products/${product.id}/metafields.json`,
      {
        headers: {
          "X-Shopify-Access-Token": adminToken,
          "Content-Type": "application/json",
        },
      }
    );
    await delay(500);

    // 3 Find stripe_product_id metafield if it exists
    let stripeProductId = productMetafields.find(
      (mf) => mf.namespace === "custom" && mf.key === "stripe_product_id"
    )?.value;

    // 4) If no stripe product ID metafield, create Stripe Product & save metafield
    if (!stripeProductId) {
      const stripeProduct = await stripe.products.create({
        name: product.title,
        images: product.image ? [product.image.src] : [],
        metadata: {
          shopify_product_id: product.id.toString(),
          variant_name: product.variants.title, 
        },
      });
      stripeProductId = stripeProduct.id;

      // Create metafield for stripe_product_id
      await fetch(`${shopifyUrl}/admin/api/2025-04/products/${product.id}/metafields.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": adminToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "stripe_product_id",
            value: stripeProductId,
            type: "single_line_text_field", // important for Shopify metafields API v2025-04
          },
        }),
      });
      await delay(500);

      console.log(`Created Stripe Product for Shopify product: ${product.title}`);
    } else {
      // Optional: update Stripe product metadata if needed
      await stripe.products.update(stripeProductId, {
        metadata: {
          shopify_product_id: product.id.toString(),
          variant_names: product.variants.map(v => v.title).join(", "), 
          stripe_price_ids: stripePriceIds.join(', ')
        },
      });
      console.log(`Stripe Product exists for Shopify product: ${product.title}`);
    }

    const stripePriceIds = [];

    // 5) Now sync variants to Stripe Prices
    for (const variant of product.variants) {
      // Fetch variant metafields
      const { metafields: variantMetafields } = await fetchJson(
        `${shopifyUrl}/admin/api/2025-04/variants/${variant.id}/metafields.json`,
        {
          headers: {
            "X-Shopify-Access-Token": adminToken,
            "Content-Type": "application/json",
          },
        }
      );
      await delay(500);

      const existingPriceId = variantMetafields.find(
        (mf) => mf.namespace === "custom" && mf.key === "stripe_price_id"
      )?.value;

      const existingDiscountedPriceId = variantMetafields.find(
        (mf) => mf.namespace === "custom" && mf.key === "stripe_discounted_price_id"
      )?.value;


      if (existingPriceId && existingDiscountedPriceId) {
        console.log(`Variant already synced: ${product.title} - ${variant.title}`);
        continue;
      }

      // Create Stripe Price for variant
      const stripePrice = await stripe.prices.create({
        unit_amount: Math.round(parseFloat(variant.price) * 100),
        currency: "gbp",
        product: stripeProductId,
        metadata: {
          shopify_variant_id: variant.id.toString(),
          variant_name: variant.title,
          price_id: variant.stripe_price_id,
        },
      });

      stripePriceIds.push(stripePrice.id);

      await stripe.prices.update(stripePrice.id, {
        metadata: {
          ...stripePrice.metadata,
          price_id: stripePrice.id,
        }
      })

      // Save stripe_price_id metafield to variant
      await fetch(`${shopifyUrl}/admin/api/2025-04/variants/${variant.id}/metafields.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": adminToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "stripe_price_id",
            value: stripePrice.id,
            type: "single_line_text_field",
          },
        }),
      });
      await delay(500);
      console.log(`Synced variant: ${product.title} - ${variant.title} to Stripe Price ${stripePrice.id}`);

      // Discounted Price (if compare_at_price is lower)
      if (
        variant.compare_at_price &&
        parseFloat(variant.compare_at_price) > parseFloat(variant.price)
      ) {
        const discountedPrice = await stripe.prices.create({
          unit_amount: Math.round(parseFloat(variant.compare_at_price) * 100),
          currency: "gbp",
          product: stripeProductId,
          metadata: {
            shopify_variant_id: variant.id.toString(),
            variant_name: variant.title,
            is_discounted: "true",
            price_id: ""
          },
        });

        await stripe.prices.update(discountedPrice.id, {
          metadata: {
            ...discountedPrice.metadata,
            price_id: discountedPrice.id,
            stripe_discounted_price_id: discountedPrice.id,
          },
        });

        // Save stripe_discounted_price_id to Shopify
        await fetch(`${shopifyUrl}/admin/api/2025-04/variants/${variant.id}/metafields.json`, {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": adminToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metafield: {
            namespace: "custom",
            key: "stripe_discounted_price_id",
            value: discountedPrice.id,
            type: "single_line_text_field",
          },
        }),
      });
      await delay(500);
      console.log(`Created discounted Stripe price for ${product.title} - ${variant.title}`);
      };
    }
  }

  console.log("Sync complete.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await syncShopifyProductsToStripe();
    return res.status(200).json({ message: "Sync complete" });
  } catch (error) {
    console.error("Sync error:", error);
    return res.status(500).json({ error: "Sync failed", details: error.message });
  }
}
