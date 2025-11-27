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
export { takaraApi } from "./takara";
export type {
  TakaraMiningStats,
  LaikaPrice,
  PoolYield,
  YieldSimulation,
  PayoutFrequency,
} from "./takara";

// Export the API client if it exists
export { apiClient } from "./client";
