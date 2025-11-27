/**
 * Takara API Client
 * Cross-chain yield calculator and mining rewards
 */

import { apiClient } from "./client";

// Types
export interface TakaraMiningStats {
  totalSupply: number;
  miningPoolTotal: number;
  miningPoolRemaining: number;
  miningPoolDistributed: number;
  percentDistributed: string;
  internalPriceUsd: number;
  isMiningActive: boolean;
}

export interface LaikaPrice {
  marketPrice: number;
  discountedPrice: number;
  discountPercent: number;
  updatedAt: string;
}

// Legacy PoolYield - use VaultYield instead
export interface PoolYield {
  poolId: number;
  minEntryAmount: number;
  lockMonths: number;
  usdtYield: {
    baseApy: number;
    maxLaikaBoost: number;
    maxApyMonthly: number;
    maxApyQuarterly: number;
    maxApyYearly: number;
  };
  takaraYield: {
    apr: number;
    miningAllocation: number;
  };
}

// TAKARA Vault Yield (TZ v4)
export interface VaultYield {
  vaultId: number;
  name: string;
  type: "VAULT_1" | "VAULT_2" | "VAULT_3";
  durationMonths: number;
  minEntryAmount: number;
  usdtYield: {
    baseApy: number;
    boostedApy: number;
    frequencyMultipliers: {
      MONTHLY: number;
      QUARTERLY: number;
      YEARLY: number;
    };
  };
  takaraYield: {
    apr: number;
    internalPrice: number;
  };
  boostCondition: {
    tokenSymbol: string;
    ratio: number;
    discount: number;
    fixedPrice: number | null;
  };
  batch: {
    number: number;
    status: "COLLECTING" | "FILLED" | "COMPLETED";
    currentLiquidity: number;
    targetLiquidity: number;
    progress: number;
  };
}

export interface YieldSimulation {
  isEligible: boolean;
  depositAmount: number;
  poolId: number;
  lockPeriodMonths: number;
  payoutFrequency: string;
  withoutBoost: {
    usdtApy: number;
    takaraApr: number;
    monthlyUsdtReward: number;
    monthlyTakaraReward: number;
    totalAnnualValue: number;
  };
  withBoost: {
    usdtApy: number;
    takaraApr: number;
    monthlyUsdtReward: number;
    monthlyTakaraReward: number;
    totalAnnualValue: number;
    additionalAnnualValue: number;
  } | null;
  laikaBoostInfo: {
    currentBalance: number;
    requiredForBoost: number;
    currentPrice: number;
    discountedPrice: number;
    isEligible: boolean;
  };
}

export type PayoutFrequency = "MONTHLY" | "QUARTERLY" | "YEARLY";

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Takara API
 */
export const takaraApi = {
  // Get Laika token price
  getLaikaPrice: async (): Promise<LaikaPrice> => {
    const res = await apiClient.get<ApiResponse<LaikaPrice>>("/api/v1/takara/laika/price");
    return res.data;
  },

  // Get mining statistics
  getMiningStats: async (): Promise<TakaraMiningStats | null> => {
    const res = await apiClient.get<ApiResponse<TakaraMiningStats | null>>(
      "/api/v1/takara/mining/stats"
    );
    return res.data;
  },

  // Get pool yield summary (legacy)
  getPoolYields: async (): Promise<PoolYield[]> => {
    const res = await apiClient.get<ApiResponse<PoolYield[]>>("/api/v1/vaults");
    return res.data;
  },

  // Get vault yields (TZ v4)
  getVaultYields: async (): Promise<VaultYield[]> => {
    const res = await apiClient.get<ApiResponse<VaultYield[]>>("/api/v1/vaults/yields");
    return res.data;
  },

  // Simulate yield for deposit
  simulateYield: async (params: {
    depositAmountUsd: number;
    poolId: number;
    payoutFrequency: PayoutFrequency;
    laikaBalance?: number;
  }): Promise<YieldSimulation> => {
    const res = await apiClient.post<ApiResponse<YieldSimulation>>(
      "/api/v1/takara/yield/simulate",
      params
    );
    return res.data;
  },

  // Check Laika boost eligibility
  checkBoostEligibility: async (
    laikaBalance: number,
    depositAmountUsd: number
  ): Promise<{
    isEligible: boolean;
    laikaValueUsd: number;
    requiredValueUsd: number;
    shortfallUsd: number;
    priceUsed: number;
  }> => {
    const res = await apiClient.post<
      ApiResponse<{
        isEligible: boolean;
        laikaValueUsd: number;
        requiredValueUsd: number;
        shortfallUsd: number;
        priceUsed: number;
      }>
    >("/api/v1/takara/laika/check-boost", {
      laikaBalance,
      depositAmountUsd,
    });
    return res.data;
  },
};
