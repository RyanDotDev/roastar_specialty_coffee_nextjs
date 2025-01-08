import { fetchShopifyData } from "@/lib/api/shopify/route";

export default async function fetchProducts(req, res) {
  try {
    const query = `
      {
        products(first: 5) {
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
    if (!data || !data.products || !data?.products?.edges) {
      throw new Error("Invalid response from Shopify");
    }

    res.status(200).json({ products: data?.products?.edges });
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

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
  
  const { data } = await fetchShopifyData(query);
  return data.product
}

export async function fetchRelatedProducts() {
  const query = `
    {
      products(first: 5) {
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
                  }
                }
              }
            } 
          }
        }
      }
    }
  `;
  
  const { data } = await fetchShopifyData(query);
  return data.products.edges
}
