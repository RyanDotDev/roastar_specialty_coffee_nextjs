import { fetchShopifyData } from "@/pages/api/new-shopify/shopify";

export async function fetchProduct(handle) {
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
              price {
                amount
                currencyCode
              }
              image {
                url
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