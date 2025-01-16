import { fetchShopifyData } from "@/lib/api/shopify/route";

export default async function fetchProducts(req, res) {
  const { handle } = req.query;
  const variables = { handle }
  try {
    const query = `
      {
        products(first: 5) {
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

    const data = await fetchShopifyData(query, variables);
    if (!data || !data.products || !data?.products?.edges) {
      throw new Error("Invalid response from Shopify");
    }
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    // res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    res.status(200).json({ products: data?.products?.edges });
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
