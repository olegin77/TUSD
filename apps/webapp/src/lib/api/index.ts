/**
 * Centralized API client exports
 */

// New API client and hooks
export { apiClient, API_BASE_URL } from "./client";
export * from "./hooks";

// Legacy API exports
export { authApi, WalletType } from "./auth";
export { depositsApi } from "./deposits";
export { collateralApi } from "./collateral";
export { marketplaceApi } from "./marketplace";

export type { WalletLoginRequest, WalletLoginResponse } from "./auth";

export type { CreateDepositDto, ConfirmDepositDto, ApplyBoostToDepositDto } from "./deposits";

export type { OpenCollateralDto, RepayLoanDto } from "./collateral";

export type { CreateListingDto, BuyListingDto, MarketplaceFilterDto } from "./marketplace";
