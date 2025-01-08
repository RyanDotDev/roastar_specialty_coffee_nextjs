import { fetchShopifyData } from "@/lib/api/shopify/route";

export async function createCheckout(lineItems) {
  const query = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: { line: lineItems }
  };

  const data = await fetchShopifyData(query, variables);

  if (data.errors) {
    throw new Error(`Shopify error: ${data.errors.map((e) => e.message).join(', ')}`);
  }

  return data.cartCreate.cart.checkoutUrl
};