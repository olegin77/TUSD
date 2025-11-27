import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Takara Mining Service
 *
 * Handles Takara token reward calculations and distribution tracking
 * Mining pool: 60% of total supply allocated for rewards
 */
@Injectable()
export class TakaraMiningService implements OnModuleInit {
  private readonly logger = new Logger(TakaraMiningService.name);

  private takaraConfig: {
    internalPriceUsd: number;
    totalSupply: number;
    miningPoolTotal: number;
    miningPoolRemaining: number;
    tokenMintAddress: string | null;
  } | null = null;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadConfig();
  }

  /**
   * Load Takara configuration from database
   */
  async loadConfig() {
    try {
      const config = await this.prisma.takaraConfig.findFirst();

      if (config) {
        this.takaraConfig = {
          internalPriceUsd: Number(config.internal_price_usd),
          totalSupply: Number(config.total_supply),
          miningPoolTotal: Number(config.mining_pool_total),
          miningPoolRemaining: Number(config.mining_pool_remaining),
          tokenMintAddress: config.token_mint_address,
        };
        this.logger.log(
          `Takara config loaded: ${this.takaraConfig.miningPoolRemaining} remaining in pool`,
        );
      } else {
        this.logger.warn('Takara config not found - please initialize');
      }
    } catch (error) {
      this.logger.error(`Failed to load Takara config: ${error.message}`);
    }
  }

  /**
   * Initialize Takara configuration
   */
  async initializeConfig(params: {
    internalPriceUsd: number;
    totalSupply: number;
    tokenMintAddress?: string;
    miningVaultAddress?: string;
    adminWalletAddress?: string;
  }): Promise<any> {
    const miningPoolTotal = params.totalSupply * 0.6; // 60% for mining

    const config = await this.prisma.takaraConfig.upsert({
      where: { id: 1 },
      update: {
        internal_price_usd: params.internalPriceUsd,
        total_supply: params.totalSupply,
        mining_pool_total: miningPoolTotal,
        mining_pool_remaining: miningPoolTotal,
        token_mint_address: params.tokenMintAddress,
        mining_vault_address: params.miningVaultAddress,
        admin_wallet_address: params.adminWalletAddress,
      },
      create: {
        id: 1,
        internal_price_usd: params.internalPriceUsd,
        total_supply: params.totalSupply,
        mining_pool_total: miningPoolTotal,
        mining_pool_remaining: miningPoolTotal,
        mining_pool_distributed: 0,
        token_mint_address: params.tokenMintAddress,
        mining_vault_address: params.miningVaultAddress,
        admin_wallet_address: params.adminWalletAddress,
      },
    });

    await this.loadConfig();
    return config;
  }

  /**
   * Get current Takara configuration
   */
  async getConfig() {
    if (!this.takaraConfig) {
      await this.loadConfig();
    }
    return this.takaraConfig;
  }

  /**
   * Calculate daily Takara reward for a deposit
   *
   * Formula: DailyTakaraReward = (DepositUSDT * Pool.takaraApr / 365) / TakaraInternalPrice
   */
  async calculateDailyTakaraReward(
    depositAmountUsd: number,
    poolTakaraApr: number, // e.g., 30, 50, 75
  ): Promise<{
    dailyRewardTakara: number;
    dailyRewardUsdValue: number;
    annualRewardTakara: number;
    priceUsed: number;
    isMiningActive: boolean;
  }> {
    const config = await this.getConfig();

    if (!config) {
      throw new Error('Takara configuration not initialized');
    }

    const isMiningActive = config.miningPoolRemaining > 0;

    if (!isMiningActive) {
      return {
        dailyRewardTakara: 0,
        dailyRewardUsdValue: 0,
        annualRewardTakara: 0,
        priceUsed: config.internalPriceUsd,
        isMiningActive: false,
      };
    }

    // Calculate daily reward in USD value
    const dailyRewardUsdValue =
      (depositAmountUsd * (poolTakaraApr / 100)) / 365;

    // Convert to Takara tokens using internal price
    const dailyRewardTakara = dailyRewardUsdValue / config.internalPriceUsd;
    const annualRewardTakara = dailyRewardTakara * 365;

    return {
      dailyRewardTakara,
      dailyRewardUsdValue,
      annualRewardTakara,
      priceUsed: config.internalPriceUsd,
      isMiningActive,
    };
  }

  /**
   * Accrue Takara rewards for a deposit
   * Called periodically to update pending rewards
   */
  async accrueRewards(
    depositId: bigint,
    depositAmountUsd: number,
    poolTakaraApr: number,
    daysSinceLastAccrual: number = 1,
  ): Promise<{
    accruedAmount: number;
    newPendingTotal: number;
    remainingPool: number;
  }> {
    const config = await this.getConfig();

    if (!config || config.miningPoolRemaining <= 0) {
      return {
        accruedAmount: 0,
        newPendingTotal: 0,
        remainingPool: config?.miningPoolRemaining || 0,
      };
    }

    const dailyReward = await this.calculateDailyTakaraReward(
      depositAmountUsd,
      poolTakaraApr,
    );

    const accruedAmount = dailyReward.dailyRewardTakara * daysSinceLastAccrual;

    // Cap at remaining pool
    const actualAccrued = Math.min(accruedAmount, config.miningPoolRemaining);

    // Get current pending reward
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    const currentPending = Number(deposit?.takara_pending || 0);
    const newPendingTotal = currentPending + actualAccrued;

    // Update deposit with new pending reward
    await this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        takara_pending: newPendingTotal,
      },
    });

    // Update vault allocation tracking
    await this.updateVaultMiningAllocation(
      deposit?.vault_id || 0,
      actualAccrued,
    );

    return {
      accruedAmount: actualAccrued,
      newPendingTotal,
      remainingPool: config.miningPoolRemaining - actualAccrued,
    };
  }

  /**
   * Process Takara claim
   * Called when user claims their pending Takara rewards
   */
  async processClaim(
    depositId: bigint,
    userSolanaAddress: string,
    claimAmount?: number, // Optional: specific amount, otherwise claim all pending
  ): Promise<{
    claimId: bigint;
    amount: number;
    status: string;
  }> {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    const pendingReward = Number(deposit.takara_pending);
    const amountToClaim = claimAmount ?? pendingReward;

    if (amountToClaim <= 0 || amountToClaim > pendingReward) {
      throw new Error('Invalid claim amount');
    }

    const config = await this.getConfig();

    // Create claim record
    const claim = await this.prisma.takaraClaimHistory.create({
      data: {
        deposit_id: depositId,
        user_address: userSolanaAddress,
        amount: amountToClaim,
        price_at_claim: config?.internalPriceUsd || 0,
        status: 'pending',
      },
    });

    // Reduce pending reward
    await this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        takara_pending: { decrement: amountToClaim },
      },
    });

    // Update global config
    await this.updateGlobalDistribution(amountToClaim);

    return {
      claimId: claim.id,
      amount: amountToClaim,
      status: 'pending',
    };
  }

  /**
   * Update claim status after on-chain confirmation
   */
  async confirmClaim(claimId: bigint, txHash: string): Promise<any> {
    return this.prisma.takaraClaimHistory.update({
      where: { id: claimId },
      data: {
        tx_hash: txHash,
        status: 'confirmed',
      },
    });
  }

  /**
   * Update vault mining allocation
   */
  private async updateVaultMiningAllocation(vaultId: number, amount: number) {
    try {
      await this.prisma.vault.update({
        where: { id: vaultId },
        data: {
          mining_allocation: { increment: amount },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update vault allocation: ${error.message}`);
    }
  }

  /**
   * Update global Takara distribution tracking
   */
  private async updateGlobalDistribution(amount: number) {
    try {
      await this.prisma.takaraConfig.update({
        where: { id: 1 },
        data: {
          mining_pool_remaining: { decrement: amount },
          mining_pool_distributed: { increment: amount },
        },
      });

      // Reload config
      await this.loadConfig();
    } catch (error) {
      this.logger.error(
        `Failed to update global distribution: ${error.message}`,
      );
    }
  }

  /**
   * Get mining statistics
   */
  async getMiningStats() {
    const config = await this.prisma.takaraConfig.findFirst();

    if (!config) {
      return null;
    }

    const percentDistributed =
      (Number(config.mining_pool_distributed) /
        Number(config.mining_pool_total)) *
      100;

    return {
      totalSupply: Number(config.total_supply),
      miningPoolTotal: Number(config.mining_pool_total),
      miningPoolRemaining: Number(config.mining_pool_remaining),
      miningPoolDistributed: Number(config.mining_pool_distributed),
      percentDistributed: percentDistributed.toFixed(2),
      internalPriceUsd: Number(config.internal_price_usd),
      isMiningActive: Number(config.mining_pool_remaining) > 0,
    };
  }

  /**
   * Get claim history for a user
   */
  async getClaimHistory(userAddress: string): Promise<any[]> {
    return this.prisma.takaraClaimHistory.findMany({
      where: { user_address: userAddress },
      orderBy: { created_at: 'desc' },
    });
  }
}
