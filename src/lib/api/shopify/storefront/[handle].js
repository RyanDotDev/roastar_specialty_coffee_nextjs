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

  const data = await fetchShopifyData(query);
  if (!data || !data.product) {
    throw new Error("Invalid Shopify response");
  }

  return data.product;
}