import { fetchShopifyData } from "../shopify";

export default async function handler(req, res) {
  if (!req || !res) {
    console.error("❌ req/res undefined – this API route was probably called incorrectly");
    return new Response("Invalid invocation", { status: 500 });
  }
  
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ error: "Missing product handle" });
  }
  
  try {
    const variables = { handle }
    const query = `
      query {
        product(handle: "${handle}") {
          id
          title
          options {
            name
            optionValues {
              name
            }
          }
          handle
          totalInventory
          productType
          descriptionHtml
          images(first: 1) {
            edges {
              node {
                url
              }
           }
          }
          discount: metafield(namespace: "custom", key: "discountPercentage") {
            value
          }
          stripe: metafield(namespace: "custom", key: "stripe_price_id") {
            value
          }
          stripeDiscount: metafield(namespace: "custom", key: "stripe_discounted_price_id") {
            value
          }
          variants(first: 12) {
            edges {
              node {
                id
                title
                selectedOptions {
                  name
                  value
                }
                availableForSale
                compareAtPrice {
                  amount
                }
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                discount: metafield(namespace: "custom", key: "discountPercentage") {
                  value
                }
                stripe: metafield(namespace: "custom", key: "stripe_price_id") {
                  value
                }
                stripeDiscount: metafield(namespace: "custom", key: "stripe_discounted_price_id") {
                  value
                }
              }
            }
          } 
        }
      }
    `;

    if (!handle) {
      res.status(400).json({ error: "Missing product handle" })
      return
    }
    const data = await fetchShopifyData(query, variables)
    if (!data || !data.product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data.product)
  } catch(error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Internal server error" })
  }
}