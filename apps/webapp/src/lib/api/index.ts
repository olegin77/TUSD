/**
 * Centralized API client exports
 */

// Export all API modules
export { authApi, WalletType } from "./auth";
export { depositsApi } from "./deposits";
export { collateralApi } from "./collateral";
export { marketplaceApi } from "./marketplace";
export { oraclesApi } from "./oracles";
export { boostApi } from "./boost";

// Export the API client if it exists
export { apiClient } from "./client";
