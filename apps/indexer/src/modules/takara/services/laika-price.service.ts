import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../database/prisma.service';

/**
 * Laika Price Service
 *
 * Fetches Laika (SPL Token) price from CoinGecko API
 * Applies 15% discount for boost eligibility calculations
 */
@Injectable()
export class LaikaPriceService {
  private readonly logger = new Logger(LaikaPriceService.name);

  // Laika token contract address on Solana (placeholder - replace with actual)
  private readonly LAIKA_MINT_ADDRESS = 'LAIKAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
  private readonly DISCOUNT_PERCENT = 15; // 15% discount for boost calculations

  private cachedPrice: {
    marketPrice: number;
    discountedPrice: number;
    updatedAt: Date;
  } | null = null;

  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

  constructor(private prisma: PrismaService) {}

  /**
   * Get Laika price from CoinGecko
   * Falls back to cached price if API fails
   */
  async getLaikaPrice(): Promise<{
    marketPrice: number;
    discountedPrice: number;
    updatedAt: Date;
  }> {
    // Return cached price if still valid
    if (this.cachedPrice &&
        Date.now() - this.cachedPrice.updatedAt.getTime() < this.CACHE_TTL_MS) {
      return this.cachedPrice;
    }

    try {
      const response = await fetch(
        `${this.COINGECKO_API_URL}/simple/price?ids=laika&vs_currencies=usd`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const marketPrice = data.laika?.usd || 0;

      if (marketPrice === 0) {
        // Try alternative: fetch by contract address
        return this.fetchByContractAddress();
      }

      const discountedPrice = marketPrice * (1 - this.DISCOUNT_PERCENT / 100);

      this.cachedPrice = {
        marketPrice,
        discountedPrice,
        updatedAt: new Date(),
      };

      // Store in database for persistence
      await this.updatePriceInDb(marketPrice, discountedPrice);

      this.logger.log(
        `Laika price updated: $${marketPrice.toFixed(6)} (discounted: $${discountedPrice.toFixed(6)})`
      );

      return this.cachedPrice;
    } catch (error) {
      this.logger.error(`Failed to fetch Laika price: ${error.message}`);

      // Return cached price if available
      if (this.cachedPrice) {
        return this.cachedPrice;
      }

      // Return from database as last resort
      return this.getPriceFromDb();
    }
  }

  /**
   * Fetch price by Solana contract address (alternative method)
   */
  private async fetchByContractAddress(): Promise<{
    marketPrice: number;
    discountedPrice: number;
    updatedAt: Date;
  }> {
    try {
      const response = await fetch(
        `${this.COINGECKO_API_URL}/simple/token_price/solana?contract_addresses=${this.LAIKA_MINT_ADDRESS}&vs_currencies=usd`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko contract API error: ${response.status}`);
      }

      const data = await response.json();
      const marketPrice = data[this.LAIKA_MINT_ADDRESS.toLowerCase()]?.usd || 0;
      const discountedPrice = marketPrice * (1 - this.DISCOUNT_PERCENT / 100);

      this.cachedPrice = {
        marketPrice,
        discountedPrice,
        updatedAt: new Date(),
      };

      await this.updatePriceInDb(marketPrice, discountedPrice);

      return this.cachedPrice;
    } catch (error) {
      this.logger.error(`Failed to fetch by contract: ${error.message}`);
      return this.getPriceFromDb();
    }
  }

  /**
   * Store price in database
   */
  private async updatePriceInDb(marketPrice: number, discountedPrice: number) {
    try {
      await this.prisma.tokenPrice.upsert({
        where: { token_mint: this.LAIKA_MINT_ADDRESS },
        update: {
          price_usd: BigInt(Math.floor(marketPrice * 1_000_000)),
          updated_at: new Date(),
        },
        create: {
          token_mint: this.LAIKA_MINT_ADDRESS,
          price_usd: BigInt(Math.floor(marketPrice * 1_000_000)),
          source: 'coingecko',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update price in DB: ${error.message}`);
    }
  }

  /**
   * Get price from database (fallback)
   */
  private async getPriceFromDb(): Promise<{
    marketPrice: number;
    discountedPrice: number;
    updatedAt: Date;
  }> {
    const price = await this.prisma.tokenPrice.findUnique({
      where: { token_mint: this.LAIKA_MINT_ADDRESS },
    });

    if (!price) {
      return {
        marketPrice: 0,
        discountedPrice: 0,
        updatedAt: new Date(),
      };
    }

    const marketPrice = Number(price.price_usd) / 1_000_000;
    const discountedPrice = marketPrice * (1 - this.DISCOUNT_PERCENT / 100);

    return {
      marketPrice,
      discountedPrice,
      updatedAt: price.updated_at,
    };
  }

  /**
   * Check if user's Laika balance qualifies for boost
   * Condition: (UserLaikaBalance * DiscountedPrice) >= (DepositUSDT * 0.40)
   */
  async checkBoostEligibility(
    laikaBalance: number,
    depositAmountUsd: number,
  ): Promise<{
    isEligible: boolean;
    laikaValueUsd: number;
    requiredValueUsd: number;
    shortfallUsd: number;
    priceUsed: number;
  }> {
    const priceData = await this.getLaikaPrice();
    const laikaValueUsd = laikaBalance * priceData.discountedPrice;
    const requiredValueUsd = depositAmountUsd * 0.40; // 40% of deposit
    const isEligible = laikaValueUsd >= requiredValueUsd;
    const shortfallUsd = isEligible ? 0 : requiredValueUsd - laikaValueUsd;

    return {
      isEligible,
      laikaValueUsd,
      requiredValueUsd,
      shortfallUsd,
      priceUsed: priceData.discountedPrice,
    };
  }

  /**
   * Create a snapshot of Laika boost eligibility for a deposit
   */
  async createBoostSnapshot(
    depositId: bigint,
    laikaBalance: number,
    depositAmountUsd: number,
  ): Promise<any> {
    const priceData = await this.getLaikaPrice();
    const laikaValueUsd = laikaBalance * priceData.discountedPrice;
    const threshold40Pct = depositAmountUsd * 0.40;
    const isEligible = laikaValueUsd >= threshold40Pct;

    return this.prisma.laikaBoostSnapshot.upsert({
      where: { deposit_id: depositId },
      update: {
        laika_balance: laikaBalance,
        laika_price_usd: priceData.marketPrice,
        laika_price_discounted: priceData.discountedPrice,
        laika_value_usd: laikaValueUsd,
        deposit_amount_usd: depositAmountUsd,
        threshold_40_pct: threshold40Pct,
        is_boost_eligible: isEligible,
        checked_at: new Date(),
      },
      create: {
        deposit_id: depositId,
        laika_balance: laikaBalance,
        laika_price_usd: priceData.marketPrice,
        laika_price_discounted: priceData.discountedPrice,
        laika_value_usd: laikaValueUsd,
        deposit_amount_usd: depositAmountUsd,
        threshold_40_pct: threshold40Pct,
        is_boost_eligible: isEligible,
      },
    });
  }

  /**
   * Scheduled job to update Laika price every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePriceUpdate() {
    this.logger.debug('Running scheduled Laika price update...');
    await this.getLaikaPrice();
  }
}
