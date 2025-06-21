import { fetchShopifyData } from "../shopify";

export default async function fetchProducts(req, res) {
  console.log("🔥 Shopify API hit at", new Date().toISOString());
  try {
    const query = `
      {
        products(first: 11) {
          edges {
            node {
              id
              title
              handle
              totalInventory
              descriptionHtml
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              } 
            }
          }
        }
      }
    `;

    const data = await fetchShopifyData(query);
    console.log("✅ Shopify returned products:", data?.products?.edges.length);
    if (!data || !data.products || !data?.products?.edges) {
      throw new Error("Invalid response from Shopify");
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ products: data?.products?.edges });
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
