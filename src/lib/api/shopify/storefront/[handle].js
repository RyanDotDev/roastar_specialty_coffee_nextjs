import { fetchShopifyData } from "@/pages/api/new-shopify/shopify";

export async function fetchProduct(handle) {
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

  const data = await fetchShopifyData(query);
  if (!data || !data.product) {
    throw new Error("Invalid Shopify response");
  }

  return data.product;
}