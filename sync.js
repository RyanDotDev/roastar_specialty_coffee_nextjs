import { syncShopifyProductsToStripe } from "../pages/api/new-shopify/admin/syncShopifyProducts";

import dotenv from "dotenv";
dotenv.config();

syncShopifyProductsToStripe()
  .then(() => console.log("✅ Sync complete"))
  .catch((err) => console.error("❌ Sync failed:", err));