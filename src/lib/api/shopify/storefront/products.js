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
                  url
                }
              }
            }
            metafield(namespace: "custom", key: "discountPercentage") {
              value
            }
            variants(first: 1) {
              edges {
                node {
                  price {
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