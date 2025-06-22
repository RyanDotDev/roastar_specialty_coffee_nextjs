import { fetchShopifyData } from "@/pages/api/new-shopify/shopify";

export async function fetchRelatedProducts() {
  const query = `
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
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