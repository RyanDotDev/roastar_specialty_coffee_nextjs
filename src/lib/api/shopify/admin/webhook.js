import { fetchShopifyAdminData } from "@/pages/api/new-shopify/shopify";

export async function registerOrderWebhook(callbackUrl) {
  const query = `
    mutation webhookSubscriptionCreate {
      webhookSubscriptionCreate(
        topic: ORDERS_CREATE
        webhookSubscription: {
          callbackUrl: "${callbackUrl}",
          format: JSON
        }
      ) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;

  const data = await fetchShopifyAdminData(query);

  if (data?.webhookSubscriptionCreate?.userErrors?.length) {
    throw new Error(
      JSON.stringify(data.webhookSubscriptionCreate.userErrors)
    );
  }

  return data.webhookSubscriptionCreate.webhookSubscription;
}