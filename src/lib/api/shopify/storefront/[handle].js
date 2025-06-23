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
        images(first: 1) {
          edges {
            node {
              src
            }
          }
        }
        metafield(namespace: "custom", key: "discountPercentage") {
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
              priceV2 {
                amount
                currencyCode
              }
              image {
                src
                altText
              }
              metafield(namespace: "custom", key: "discountPercentage") {
                value
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