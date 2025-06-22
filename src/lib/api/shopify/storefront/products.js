import { fetchShopifyData } from "@/pages/api/new-shopify/shopify";

export async function fetchProducts() {
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
  if (!data || !data.products || !data.products.edges) {
    throw new Error("Invalid Shopify response");
  }

  return data.products.edges;
}