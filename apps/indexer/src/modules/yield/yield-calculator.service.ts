import { Injectable } from '@nestjs/common';
import { PayoutFrequency } from '@prisma/client';

/**
 * YieldCalculatorService - Master v6 Compliant
 *
 * Handles all yield calculations with precision using basis points (bps)
 *
 * APY Values per Master v6:
 * - Vault 1 (Starter): 7% base + 1.4% boost = 8.4% max (LAIKA boost, 40% of deposit)
 * - Vault 2 (Advanced): 7% base + 6% boost = 13% max (TAKARA boost, 1:1)
 * - Vault 3 (Whale): 8% base + 7% boost = 15% max (TAKARA boost, 1:1)
 *
 * Frequency Multipliers:
 * - Monthly: x1.0
 * - Quarterly: x1.15
 * - Yearly: x1.30
 */
@Injectable()
export class YieldCalculatorService {
  // Frequency multipliers per master.md
  private readonly FREQUENCY_MULTIPLIERS: Record<PayoutFrequency, number> = {
    MONTHLY: 1.0,
    QUARTERLY: 1.15,
    YEARLY: 1.30,
  };

  // Vault APY configurations per master.md v6
  private readonly VAULT_APY_CONFIG: Record<string, {
    baseApyBps: number;
    boostApyBps: number;
    maxApyBps: number;
    takaraAprBps: number;
    boostToken: string;
    boostRatio: number;
    boostDiscount?: number;
    boostFixedPrice?: number;
  }> = {
    VAULT_1: {
      baseApyBps: 700,   // 7.00%
      boostApyBps: 140,  // 1.40%
      maxApyBps: 840,    // 8.40%
      takaraAprBps: 3000, // 30%
      boostToken: 'LAIKA',
      boostRatio: 0.4,   // 40% of deposit
      boostDiscount: 0.15, // 15% discount on market price
    },
    VAULT_2: {
      baseApyBps: 700,   // 7.00%
      boostApyBps: 600,  // 6.00%
      maxApyBps: 1300,   // 13.00%
      takaraAprBps: 3000, // 30%
      boostToken: 'TAKARA',
      boostRatio: 1.0,   // 1:1 to deposit
      boostFixedPrice: 0.10, // Fixed $0.10
    },
    VAULT_3: {
      baseApyBps: 800,   // 8.00%
      boostApyBps: 700,  // 7.00%
      maxApyBps: 1500,   // 15.00%
      takaraAprBps: 4000, // 40%
      boostToken: 'TAKARA',
      boostRatio: 1.0,   // 1:1 to deposit
      boostFixedPrice: 0.10, // Fixed $0.10
    },
  };

  /**
   * Calculate effective APY with frequency multiplier
   * @param baseApyBps Base APY in basis points
   * @param boostApyBps Boost APY in basis points (0 if no boost)
   * @param frequency Payout frequency
   * @returns Effective APY in percent (e.g., 8.4 for 8.4%)
   */
  calculateEffectiveApy(
    baseApyBps: number,
    boostApyBps: number,
    frequency: PayoutFrequency,
  ): number {
    const totalBps = baseApyBps + boostApyBps;
    const multiplier = this.FREQUENCY_MULTIPLIERS[frequency];
    return (totalBps / 100) * multiplier;
  }

  /**
   * Calculate all APY variants for a vault
   * @param vaultType VAULT_1, VAULT_2, or VAULT_3
   * @param hasBoost Whether boost is active
   * @returns Object with all APY calculations
   */
  calculateVaultApyVariants(vaultType: string, hasBoost: boolean) {
    const config = this.VAULT_APY_CONFIG[vaultType];
    const baseApyBps = config.baseApyBps;
    const boostApyBps = hasBoost ? config.boostApyBps : 0;
    const totalApyBps = baseApyBps + boostApyBps;

    return {
      baseApyPercent: baseApyBps / 100,
      boostApyPercent: boostApyBps / 100,
      totalApyPercent: totalApyBps / 100,
      // With frequency multipliers
      apyMonthly: this.calculateEffectiveApy(baseApyBps, boostApyBps, PayoutFrequency.MONTHLY),
      apyQuarterly: this.calculateEffectiveApy(baseApyBps, boostApyBps, PayoutFrequency.QUARTERLY),
      apyYearly: this.calculateEffectiveApy(baseApyBps, boostApyBps, PayoutFrequency.YEARLY),
      // Basis points for precision
      baseApyBps,
      boostApyBps,
      totalApyBps,
      // Takara mining
      takaraAprBps: config.takaraAprBps,
      takaraAprPercent: config.takaraAprBps / 100,
    };
  }

  /**
   * Calculate USDT yield for a deposit
   * @param principalUsd Principal amount in USD
   * @param baseApyBps Base APY in basis points
   * @param boostApyBps Boost APY in basis points
   * @param frequency Payout frequency
   * @param durationMonths Lock duration in months
   * @returns Yield breakdown
   */
  calculateUsdtYield(
    principalUsd: number,
    baseApyBps: number,
    boostApyBps: number,
    frequency: PayoutFrequency,
    durationMonths: number,
  ) {
    const effectiveApy = this.calculateEffectiveApy(baseApyBps, boostApyBps, frequency);
    const yearlyYield = principalUsd * (effectiveApy / 100);
    const monthlyYield = yearlyYield / 12;
    const totalYield = yearlyYield * (durationMonths / 12);

    // Calculate number of payouts based on frequency
    const payoutsPerYear = {
      MONTHLY: 12,
      QUARTERLY: 4,
      YEARLY: 1,
    }[frequency];
    const totalPayouts = Math.floor((durationMonths / 12) * payoutsPerYear);
    const yieldPerPayout = totalYield / totalPayouts;

    return {
      effectiveApyPercent: effectiveApy,
      yearlyYieldUsd: Math.round(yearlyYield * 100) / 100,
      monthlyYieldUsd: Math.round(monthlyYield * 100) / 100,
      totalYieldUsd: Math.round(totalYield * 100) / 100,
      payoutsCount: totalPayouts,
      yieldPerPayoutUsd: Math.round(yieldPerPayout * 100) / 100,
      finalAmountUsd: Math.round((principalUsd + totalYield) * 100) / 100,
    };
  }

  /**
   * Calculate Takara mining rewards
   * @param principalUsd Principal amount in USD
   * @param takaraAprBps Takara APR in basis points
   * @param durationMonths Lock duration in months
   * @param takaraPriceUsd Current Takara price in USD
   * @returns Takara mining breakdown
   */
  calculateTakaraRewards(
    principalUsd: number,
    takaraAprBps: number,
    durationMonths: number,
    takaraPriceUsd: number = 0.10,
  ) {
    const takaraApr = takaraAprBps / 100; // Convert to percent
    const yearlyRewardUsd = principalUsd * (takaraApr / 100);
    const totalRewardUsd = yearlyRewardUsd * (durationMonths / 12);
    const takaraTokens = totalRewardUsd / takaraPriceUsd;

    return {
      takaraAprPercent: takaraApr,
      yearlyRewardUsd: Math.round(yearlyRewardUsd * 100) / 100,
      totalRewardUsd: Math.round(totalRewardUsd * 100) / 100,
      takaraTokensEarned: Math.round(takaraTokens * 100) / 100,
      takaraPriceUsed: takaraPriceUsd,
    };
  }

  /**
   * Calculate boost token requirement for full APY
   * @param depositAmountUsd Deposit amount in USD
   * @param vaultType Vault type
   * @param marketPriceUsd Market price of boost token (for LAIKA)
   * @returns Boost token requirement details
   */
  calculateBoostRequirement(
    depositAmountUsd: number,
    vaultType: string,
    marketPriceUsd?: number,
  ) {
    const config = this.VAULT_APY_CONFIG[vaultType];

    if (config.boostToken === 'LAIKA') {
      // Laika: 40% of deposit at market price - 15% discount
      const requiredValueUsd = depositAmountUsd * config.boostRatio;
      const effectivePrice = marketPriceUsd
        ? marketPriceUsd * (1 - config.boostDiscount!)
        : 0;
      const tokensRequired = effectivePrice > 0 ? requiredValueUsd / effectivePrice : 0;

      return {
        boostToken: 'LAIKA',
        requiredValueUsd: Math.round(requiredValueUsd * 100) / 100,
        marketPriceUsd: marketPriceUsd || 0,
        discountPercent: config.boostDiscount! * 100,
        effectivePriceUsd: Math.round(effectivePrice * 10000) / 10000,
        tokensRequired: Math.round(tokensRequired * 100) / 100,
        boostApyUnlocked: config.boostApyBps / 100,
      };
    } else {
      // Takara: 1:1 at fixed $0.10
      const fixedPrice = config.boostFixedPrice || 0.10;
      const tokensRequired = depositAmountUsd / fixedPrice;

      return {
        boostToken: 'TAKARA',
        requiredValueUsd: depositAmountUsd,
        fixedPriceUsd: fixedPrice,
        tokensRequired: Math.round(tokensRequired * 100) / 100,
        boostApyUnlocked: config.boostApyBps / 100,
      };
    }
  }

  /**
   * Calculate complete deposit projection
   * @param params Deposit parameters
   * @returns Complete projection with USDT yield, Takara rewards, and boost info
   */
  calculateDepositProjection(params: {
    depositAmountUsd: number;
    vaultType: 'VAULT_1' | 'VAULT_2' | 'VAULT_3';
    frequency: PayoutFrequency;
    durationMonths: number;
    hasBoost: boolean;
    boostTokenMarketPrice?: number;
    takaraPriceUsd?: number;
  }) {
    const config = this.VAULT_APY_CONFIG[params.vaultType];
    const apyVariants = this.calculateVaultApyVariants(params.vaultType, params.hasBoost);

    const usdtYield = this.calculateUsdtYield(
      params.depositAmountUsd,
      config.baseApyBps,
      params.hasBoost ? config.boostApyBps : 0,
      params.frequency,
      params.durationMonths,
    );

    const takaraRewards = this.calculateTakaraRewards(
      params.depositAmountUsd,
      config.takaraAprBps,
      params.durationMonths,
      params.takaraPriceUsd,
    );

    const boostRequirement = this.calculateBoostRequirement(
      params.depositAmountUsd,
      params.vaultType,
      params.boostTokenMarketPrice,
    );

    return {
      deposit: {
        amountUsd: params.depositAmountUsd,
        vaultType: params.vaultType,
        frequency: params.frequency,
        durationMonths: params.durationMonths,
        hasBoost: params.hasBoost,
      },
      apy: apyVariants,
      usdtYield,
      takaraRewards,
      boostRequirement,
      summary: {
        totalUsdtYield: usdtYield.totalYieldUsd,
        totalTakaraTokens: takaraRewards.takaraTokensEarned,
        totalTakaraValueUsd: takaraRewards.totalRewardUsd,
        finalPrincipalReturn: params.depositAmountUsd,
        totalValueAtEnd:
          params.depositAmountUsd +
          usdtYield.totalYieldUsd +
          takaraRewards.totalRewardUsd,
      },
    };
  }

  /**
   * Get vault configuration
   */
  getVaultConfig(vaultType: string) {
    return this.VAULT_APY_CONFIG[vaultType];
  }

  /**
   * Get all vault configurations
   */
  getAllVaultConfigs() {
    return this.VAULT_APY_CONFIG;
  }
}
