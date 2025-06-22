import { fetchShopifyData } from "@/pages/api/new-shopify/shopify";

export async function fetchCartSliderProducts() {
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
          }
        }
      }
    }
  `;

  const data = await fetchShopifyData(query);
  if (!data || !data.products || !data?.products?.edges) {
    throw new Error("Invalid response from Shopify");
  }
  
  return data.products.edges;
}