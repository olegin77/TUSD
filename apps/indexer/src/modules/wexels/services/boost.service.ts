import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { PriceOracleService } from '../../oracles/services/price-oracle.service';

export interface BoostCalculation {
  tokenMint: string;
  amount: bigint;
  priceUsd: number;
  valueUsd: number;
  apyBoostBp: number;
  maxBoostBp: number;
  targetValueUsd: number;
  isValid: boolean;
  error?: string;
}

export interface BoostApplication {
  wexelId: bigint;
  tokenMint: string;
  amount: bigint;
  priceUsd: number;
  valueUsd: number;
  apyBoostBp: number;
  txHash?: string;
}

@Injectable()
export class BoostService {
  private readonly logger = new Logger(BoostService.name);
  private readonly BOOST_TARGET_BP = 3000; // 30% of principal
  private readonly BOOST_MAX_BP = 500; // +5% APY maximum

  constructor(
    private readonly prisma: PrismaService,
    private readonly priceOracle: PriceOracleService,
  ) {}

  async calculateBoost(
    wexelId: bigint,
    tokenMint: string,
    amount: bigint,
  ): Promise<BoostCalculation> {
    try {
      // Get wexel information
      const wexel = await this.prisma.wexel.findUnique({
        where: { id: wexelId },
        include: { pool: true },
      });

      if (!wexel) {
        return {
          tokenMint,
          amount,
          priceUsd: 0,
          valueUsd: 0,
          apyBoostBp: 0,
          maxBoostBp: this.BOOST_MAX_BP,
          targetValueUsd: 0,
          isValid: false,
          error: 'Wexel not found',
        };
      }

      // Get current price
      const priceData = await this.priceOracle.getPrice(tokenMint);
      if (!priceData) {
        return {
          tokenMint,
          amount,
          priceUsd: 0,
          valueUsd: 0,
          apyBoostBp: 0,
          maxBoostBp: this.BOOST_MAX_BP,
          targetValueUsd: 0,
          isValid: false,
          error: 'Price not available for this token',
        };
      }

      const priceUsd = priceData.priceUsd;
      const valueUsd = (Number(amount) / 1e6) * priceUsd; // Convert from micro-units

      // Calculate boost target (30% of principal)
      const targetValueUsd =
        (Number(wexel.principal_usd) / 1e6) * (this.BOOST_TARGET_BP / 10000);

      // Get existing boost value
      const existingBoosts = await this.prisma.boost.findMany({
        where: { wexel_id: wexelId },
      });

      const existingValueUsd = existingBoosts.reduce(
        (sum, boost) => sum + Number(boost.value_usd) / 1e6,
        0,
      );

      const totalValueUsd = existingValueUsd + valueUsd;

      // Check if boost target would be exceeded
      if (totalValueUsd > targetValueUsd) {
        return {
          tokenMint,
          amount,
          priceUsd,
          valueUsd,
          apyBoostBp: 0,
          maxBoostBp: this.BOOST_MAX_BP,
          targetValueUsd,
          isValid: false,
          error: `Boost target exceeded. Maximum additional value: $${(targetValueUsd - existingValueUsd).toFixed(2)}`,
        };
      }

      // Calculate boost APY (max 5%)
      const boostRatio = totalValueUsd / (Number(wexel.principal_usd) / 1e6);
      const apyBoostBp = Math.min(
        Math.floor(boostRatio * 10000),
        this.BOOST_MAX_BP,
      );

      return {
        tokenMint,
        amount,
        priceUsd,
        valueUsd,
        apyBoostBp,
        maxBoostBp: this.BOOST_MAX_BP,
        targetValueUsd,
        isValid: true,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate boost: ${error.message}`);
      return {
        tokenMint,
        amount,
        priceUsd: 0,
        valueUsd: 0,
        apyBoostBp: 0,
        maxBoostBp: this.BOOST_MAX_BP,
        targetValueUsd: 0,
        isValid: false,
        error: 'Internal error',
      };
    }
  }

  async applyBoost(boostApplication: BoostApplication): Promise<boolean> {
    try {
      // Start transaction
      await this.prisma.$transaction(async (tx) => {
        // Create boost record
        await tx.boost.create({
          data: {
            wexel_id: boostApplication.wexelId,
            token_mint: boostApplication.tokenMint,
            amount: boostApplication.amount,
            value_usd: BigInt(Math.round(boostApplication.valueUsd * 1e6)),
            apy_boost_bp: boostApplication.apyBoostBp,
            price_usd: BigInt(Math.round(boostApplication.priceUsd * 1e6)),
          },
        });

        // Update wexel with new boost APY
        const wexel = await tx.wexel.findUnique({
          where: { id: boostApplication.wexelId },
        });

        if (wexel) {
          const newApyBoostBp = Math.min(
            wexel.apy_boost_bp + boostApplication.apyBoostBp,
            this.BOOST_MAX_BP,
          );

          await tx.wexel.update({
            where: { id: boostApplication.wexelId },
            data: { apy_boost_bp: newApyBoostBp },
          });
        }
      });

      this.logger.log(
        `Boost applied successfully for wexel ${boostApplication.wexelId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to apply boost: ${error.message}`);
      return false;
    }
  }

  async getWexelBoosts(wexelId: bigint) {
    return await this.prisma.boost.findMany({
      where: { wexel_id: wexelId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getBoostHistory(wexelId: bigint) {
    const boosts = await this.getWexelBoosts(wexelId);

    return boosts.map((boost) => ({
      id: boost.id,
      tokenMint: boost.token_mint,
      amount: Number(boost.amount) / 1e6,
      valueUsd: Number(boost.value_usd) / 1e6,
      apyBoostBp: boost.apy_boost_bp,
      priceUsd: Number(boost.price_usd) / 1e6,
      createdAt: boost.created_at,
    }));
  }

  async getTotalBoostValue(wexelId: bigint): Promise<number> {
    const boosts = await this.getWexelBoosts(wexelId);
    return boosts.reduce(
      (sum, boost) => sum + Number(boost.value_usd) / 1e6,
      0,
    );
  }

  async getRemainingBoostCapacity(wexelId: bigint): Promise<number> {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: wexelId },
    });

    if (!wexel) {
      return 0;
    }

    const targetValueUsd =
      (Number(wexel.principal_usd) / 1e6) * (this.BOOST_TARGET_BP / 10000);
    const currentValueUsd = await this.getTotalBoostValue(wexelId);

    return Math.max(0, targetValueUsd - currentValueUsd);
  }

  async validateBoostToken(tokenMint: string): Promise<boolean> {
    // Check if token is supported by price oracle
    const supportedTokens = await this.priceOracle.getSupportedTokens();
    return supportedTokens.includes(tokenMint);
  }

  async getBoostStats(wexelId: bigint) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: wexelId },
      include: { pool: true },
    });

    if (!wexel) {
      return null;
    }

    const totalBoostValue = await this.getTotalBoostValue(wexelId);
    const targetValueUsd =
      (Number(wexel.principal_usd) / 1e6) * (this.BOOST_TARGET_BP / 10000);
    const remainingCapacity = await this.getRemainingBoostCapacity(wexelId);
    const boostProgress =
      targetValueUsd > 0 ? (totalBoostValue / targetValueUsd) * 100 : 0;

    return {
      wexelId: wexel.id,
      principalUsd: Number(wexel.principal_usd) / 1e6,
      currentApyBoostBp: wexel.apy_boost_bp,
      maxApyBoostBp: this.BOOST_MAX_BP,
      totalBoostValue,
      targetValueUsd,
      remainingCapacity,
      boostProgress,
      isMaxBoost: wexel.apy_boost_bp >= this.BOOST_MAX_BP,
    };
  }
}
