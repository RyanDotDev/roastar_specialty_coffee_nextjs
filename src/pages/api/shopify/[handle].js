import { fetchShopifyData } from "./route";

export default async function fetchProduct(req, res) {
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
            values
          }
          handle
          totalInventory
          productType
          descriptionHtml
          metafield(namespace: "custom", key: "ingredients") {
            namespace
            key
            value
          }
          images(first: 1) {
            edges {
              node {
                src
              }
           }
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
                priceV2 {
                  amount
                  currencyCode
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