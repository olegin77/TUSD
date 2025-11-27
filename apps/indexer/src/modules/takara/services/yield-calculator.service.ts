import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { LaikaPriceService } from './laika-price.service';
import { TakaraMiningService } from './takara-mining.service';

// PayoutFrequency enum - matches Prisma schema
enum PayoutFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

/**
 * Cross-Chain Yield Calculator Service
 *
 * Calculates combined yield from:
 * - USDT rewards (TRC20 on TRON)
 * - Takara mining rewards (SPL on Solana)
 *
 * Frequency multipliers:
 * - Monthly: 1.0x
 * - Quarterly: 1.15x
 * - Yearly: 1.30x
 */
@Injectable()
export class YieldCalculatorService {
  private readonly logger = new Logger(YieldCalculatorService.name);

  // Payout frequency multipliers
  private readonly FREQUENCY_MULTIPLIERS = {
    [PayoutFrequency.MONTHLY]: 1.0,
    [PayoutFrequency.QUARTERLY]: 1.15,
    [PayoutFrequency.YEARLY]: 1.3,
  };

  constructor(
    private prisma: PrismaService,
    private laikaPriceService: LaikaPriceService,
    private takaraMiningService: TakaraMiningService,
  ) {}

  /**
   * Calculate total yield for a deposit
   *
   * USDT APY = (BaseApy + LaikaBoost) * FrequencyMultiplier
   * Takara APR = Pool.takaraApr (separate, in Takara tokens)
   */
  async calculateTotalYield(params: {
    depositId: bigint;
    depositAmountUsd: number;
    vaultId: number;
    payoutFrequency: PayoutFrequency;
    laikaBalance?: number;
    solanaWallet?: string;
  }): Promise<YieldCalculation> {
    // Get vault configuration
    const vault = await this.prisma.vault.findUnique({
      where: { id: params.vaultId },
    });

    if (!vault) {
      throw new Error('Vault not found');
    }

    // Check Laika boost eligibility
    let isLaikaBoostActive = false;
    let laikaBoostDetails: {
      isEligible: boolean;
      laikaValueUsd: number;
      requiredValueUsd: number;
      shortfallUsd: number;
      priceUsed: number;
    } | null = null;

    if (params.laikaBalance && params.laikaBalance > 0) {
      const boostCheck = await this.laikaPriceService.checkBoostEligibility(
        params.laikaBalance,
        params.depositAmountUsd,
      );
      isLaikaBoostActive = boostCheck.isEligible;
      laikaBoostDetails = boostCheck;
    }

    // Calculate USDT APY
    const baseUsdtApy = vault.base_usdt_apy;
    const laikaBoostApy = isLaikaBoostActive ? vault.laika_boost_max : 0;
    const frequencyMultiplier =
      this.FREQUENCY_MULTIPLIERS[params.payoutFrequency];

    const totalUsdtApy = (baseUsdtApy + laikaBoostApy) * frequencyMultiplier;

    // Calculate USDT rewards
    const annualUsdtReward = params.depositAmountUsd * (totalUsdtApy / 100);
    const monthlyUsdtReward = annualUsdtReward / 12;
    const dailyUsdtReward = annualUsdtReward / 365;

    // Calculate Takara rewards
    const takaraReward =
      await this.takaraMiningService.calculateDailyTakaraReward(
        params.depositAmountUsd,
        vault.takara_apr,
      );

    // Get Takara USD value for total calculation
    const takaraConfig = await this.takaraMiningService.getConfig();
    const takaraAnnualUsdValue =
      takaraReward.annualRewardTakara * (takaraConfig?.internalPriceUsd || 0);

    // Combined effective APY (USDT + Takara value)
    const combinedAnnualUsdValue = annualUsdtReward + takaraAnnualUsdValue;
    const effectiveCombinedApy =
      (combinedAnnualUsdValue / params.depositAmountUsd) * 100;

    return {
      depositId: params.depositId.toString(),
      depositAmountUsd: params.depositAmountUsd,
      vaultId: params.vaultId,
      payoutFrequency: params.payoutFrequency,

      // USDT Rewards (TRC20)
      usdt: {
        baseApy: baseUsdtApy,
        laikaBoostApy: laikaBoostApy,
        frequencyMultiplier: frequencyMultiplier,
        totalApy: totalUsdtApy,
        dailyReward: dailyUsdtReward,
        monthlyReward: monthlyUsdtReward,
        annualReward: annualUsdtReward,
      },

      // Takara Rewards (SPL)
      takara: {
        apr: vault.takara_apr,
        dailyRewardTokens: takaraReward.dailyRewardTakara,
        annualRewardTokens: takaraReward.annualRewardTakara,
        dailyRewardUsdValue: takaraReward.dailyRewardUsdValue,
        annualRewardUsdValue: takaraAnnualUsdValue,
        internalPriceUsd: takaraConfig?.internalPriceUsd || 0,
        isMiningActive: takaraReward.isMiningActive,
      },

      // Laika Boost
      laikaBoost: {
        isActive: isLaikaBoostActive,
        details: laikaBoostDetails,
      },

      // Combined
      combined: {
        effectiveApy: effectiveCombinedApy,
        annualRewardUsdValue: combinedAnnualUsdValue,
      },

      calculatedAt: new Date(),
    };
  }

  /**
   * Calculate rewards earned for a specific period
   */
  async calculatePeriodRewards(params: {
    depositId: bigint;
    depositAmountUsd: number;
    vaultId: number;
    payoutFrequency: PayoutFrequency;
    startDate: Date;
    endDate: Date;
    isLaikaBoostActive: boolean;
  }): Promise<PeriodRewards> {
    const vault = await this.prisma.vault.findUnique({
      where: { id: params.vaultId },
    });

    if (!vault) {
      throw new Error('Vault not found');
    }

    const daysInPeriod = Math.ceil(
      (params.endDate.getTime() - params.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // USDT calculation
    const baseUsdtApy = vault.base_usdt_apy;
    const laikaBoostApy = params.isLaikaBoostActive ? vault.laika_boost_max : 0;
    const frequencyMultiplier =
      this.FREQUENCY_MULTIPLIERS[params.payoutFrequency];
    const totalUsdtApy = (baseUsdtApy + laikaBoostApy) * frequencyMultiplier;

    const dailyUsdtRate = totalUsdtApy / 365 / 100;
    const usdtReward = params.depositAmountUsd * dailyUsdtRate * daysInPeriod;

    // Takara calculation
    const takaraReward =
      await this.takaraMiningService.calculateDailyTakaraReward(
        params.depositAmountUsd,
        vault.takara_apr,
      );
    const periodTakaraReward = takaraReward.dailyRewardTakara * daysInPeriod;

    return {
      depositId: params.depositId.toString(),
      periodStart: params.startDate,
      periodEnd: params.endDate,
      daysInPeriod,
      usdtReward,
      takaraReward: periodTakaraReward,
      takaraRewardUsdValue: takaraReward.dailyRewardUsdValue * daysInPeriod,
    };
  }

  /**
   * Get yield summary for all vaults
   */
  async getVaultYieldSummary() {
    const vaults = await this.prisma.vault.findMany({
      where: { is_active: true },
    });

    return vaults.map((vault) => ({
      vaultId: vault.id,
      minEntryAmount: Number(vault.min_entry_amount),
      durationMonths: vault.duration_months,

      usdtYield: {
        baseApy: vault.base_usdt_apy,
        maxLaikaBoost: vault.laika_boost_max,
        maxApyMonthly: vault.base_usdt_apy + vault.laika_boost_max,
        maxApyQuarterly: (vault.base_usdt_apy + vault.laika_boost_max) * 1.15,
        maxApyYearly: (vault.base_usdt_apy + vault.laika_boost_max) * 1.3,
      },

      takaraYield: {
        apr: vault.takara_apr,
        miningAllocation: Number(vault.mining_allocation),
      },
    }));
  }

  /**
   * Simulate yield for a potential deposit
   */
  async simulateYield(params: {
    depositAmountUsd: number;
    vaultId: number;
    payoutFrequency: PayoutFrequency;
    laikaBalance?: number;
  }): Promise<YieldSimulation> {
    const vault = await this.prisma.vault.findUnique({
      where: { id: params.vaultId },
    });

    if (!vault) {
      throw new Error('Vault not found');
    }

    // Check minimum entry
    if (params.depositAmountUsd < Number(vault.min_entry_amount)) {
      return {
        isEligible: false,
        error: `Minimum deposit is $${vault.min_entry_amount}`,
        minRequired: Number(vault.min_entry_amount),
      } as any;
    }

    // Calculate with and without Laika boost
    const baseYield = await this.calculateTotalYield({
      depositId: BigInt(0),
      depositAmountUsd: params.depositAmountUsd,
      vaultId: params.vaultId,
      payoutFrequency: params.payoutFrequency,
      laikaBalance: 0,
    });

    let boostedYield: YieldCalculation | null = null;
    let laikaRequired = 0;

    if (params.laikaBalance && params.laikaBalance > 0) {
      boostedYield = await this.calculateTotalYield({
        depositId: BigInt(0),
        depositAmountUsd: params.depositAmountUsd,
        vaultId: params.vaultId,
        payoutFrequency: params.payoutFrequency,
        laikaBalance: params.laikaBalance,
      });
    }

    // Calculate Laika needed for boost
    const laikaPrice = await this.laikaPriceService.getLaikaPrice();
    if (laikaPrice.discountedPrice > 0) {
      const requiredUsdValue = params.depositAmountUsd * 0.4;
      laikaRequired = requiredUsdValue / laikaPrice.discountedPrice;
    }

    return {
      isEligible: true,
      depositAmount: params.depositAmountUsd,
      vaultId: params.vaultId,
      durationMonths: vault.duration_months,
      payoutFrequency: params.payoutFrequency,

      withoutBoost: {
        usdtApy: baseYield.usdt.totalApy,
        takaraApr: baseYield.takara.apr,
        monthlyUsdtReward: baseYield.usdt.monthlyReward,
        monthlyTakaraReward: baseYield.takara.dailyRewardTokens * 30,
        totalAnnualValue: baseYield.combined.annualRewardUsdValue,
      },

      withBoost:
        boostedYield !== null
          ? {
              usdtApy: boostedYield.usdt.totalApy,
              takaraApr: boostedYield.takara.apr,
              monthlyUsdtReward: boostedYield.usdt.monthlyReward,
              monthlyTakaraReward: boostedYield.takara.dailyRewardTokens * 30,
              totalAnnualValue: boostedYield.combined.annualRewardUsdValue,
              additionalAnnualValue:
                boostedYield.combined.annualRewardUsdValue -
                baseYield.combined.annualRewardUsdValue,
            }
          : null,

      laikaBoostInfo: {
        currentBalance: params.laikaBalance || 0,
        requiredForBoost: laikaRequired,
        currentPrice: laikaPrice.marketPrice,
        discountedPrice: laikaPrice.discountedPrice,
        isEligible:
          boostedYield !== null ? boostedYield.laikaBoost.isActive : false,
      },
    };
  }

  /**
   * Update deposit with Laika boost status
   */
  async updateDepositBoostStatus(depositId: bigint, laikaBalance: number) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      include: { vault: true },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    const depositAmountUsd = Number(deposit.amount_usd) / 1_000_000;

    const boostCheck = await this.laikaPriceService.checkBoostEligibility(
      laikaBalance,
      depositAmountUsd,
    );

    // Create snapshot
    await this.laikaPriceService.createBoostSnapshot(
      depositId,
      laikaBalance,
      depositAmountUsd,
    );

    // Update deposit
    await this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        is_laika_boosted: boostCheck.isEligible,
      },
    });

    return {
      depositId: depositId.toString(),
      isBoostActive: boostCheck.isEligible,
      details: boostCheck,
    };
  }
}

// Types - exported for controller use
export interface YieldCalculation {
  depositId: string;
  depositAmountUsd: number;
  vaultId: number;
  payoutFrequency: PayoutFrequency;
  usdt: {
    baseApy: number;
    laikaBoostApy: number;
    frequencyMultiplier: number;
    totalApy: number;
    dailyReward: number;
    monthlyReward: number;
    annualReward: number;
  };
  takara: {
    apr: number;
    dailyRewardTokens: number;
    annualRewardTokens: number;
    dailyRewardUsdValue: number;
    annualRewardUsdValue: number;
    internalPriceUsd: number;
    isMiningActive: boolean;
  };
  laikaBoost: {
    isActive: boolean;
    details: any;
  };
  combined: {
    effectiveApy: number;
    annualRewardUsdValue: number;
  };
  calculatedAt: Date;
}

export interface PeriodRewards {
  depositId: string;
  periodStart: Date;
  periodEnd: Date;
  daysInPeriod: number;
  usdtReward: number;
  takaraReward: number;
  takaraRewardUsdValue: number;
}

export interface YieldSimulation {
  isEligible: boolean;
  depositAmount: number;
  vaultId: number;
  durationMonths: number;
  payoutFrequency: PayoutFrequency;
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
