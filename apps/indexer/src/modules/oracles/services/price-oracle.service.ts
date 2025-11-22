import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { PythOracleService } from './pyth-oracle.service';
import { DexOracleService } from './dex-oracle.service';

export interface AggregatedPrice {
  price: number;
  sources: {
    pyth?: number;
    dex?: number;
    cached?: number;
  };
  confidence: number;
  timestamp: number;
}

@Injectable()
export class PriceOracleService {
  private readonly logger = new Logger(PriceOracleService.name);

  // Maximum acceptable deviation between sources (in basis points)
  private readonly MAX_DEVIATION_BP = 150; // 1.5%

  constructor(
    private prisma: PrismaService,
    private pythOracle: PythOracleService,
    private dexOracle: DexOracleService,
  ) {}

  /**
   * Get aggregated token price from multiple sources
   * Implements price aggregation as per TZ section 6
   */
  async getTokenPrice(tokenMint: string): Promise<bigint> {
    try {
      const aggregated = await this.getAggregatedPrice(tokenMint);

      if (!aggregated) {
        // Fallback to cached price
        const cached = await this.getCachedPrice(tokenMint);
        if (cached) {
          this.logger.warn(`Using cached price for ${tokenMint}`);
          return cached;
        }

        throw new Error(`No price available for ${tokenMint}`);
      }

      // Store in cache
      await this.updateCachedPrice(
        tokenMint,
        BigInt(Math.floor(aggregated.price * 1_000000)),
      );

      // Return price in micro-units (6 decimals)
      return BigInt(Math.floor(aggregated.price * 1_000000));
    } catch (error) {
      this.logger.error(`Failed to get price for ${tokenMint}`, error);
      throw error;
    }
  }

  /**
   * Get aggregated price from Pyth, DEX, and cache
   * Implements multi-source aggregation with deviation check
   */
  async getAggregatedPrice(tokenMint: string): Promise<AggregatedPrice | null> {
    const sources: AggregatedPrice['sources'] = {};

    // 1. Try Pyth (highest priority)
    try {
      const pythPrice = await this.pythOracle.getPriceWithConfidence(tokenMint);
      if (pythPrice) {
        sources.pyth = pythPrice.price;
      }
    } catch (error) {
      this.logger.warn(`Pyth price unavailable for ${tokenMint}`, error);
    }

    // 2. Try DEX TWAP
    try {
      const dexPrice = await this.dexOracle.getTWAP(tokenMint, 'USDC', 10);
      if (dexPrice) {
        sources.dex = dexPrice.price;
      }
    } catch (error) {
      this.logger.warn(`DEX price unavailable for ${tokenMint}`, error);
    }

    // 3. Get cached price as fallback
    try {
      const cached = await this.getCachedPrice(tokenMint);
      if (cached) {
        sources.cached = Number(cached) / 1_000000;
      }
    } catch (error) {
      this.logger.debug(`No cached price for ${tokenMint}`);
    }

    // Check if we have at least one source
    const availableSources = Object.entries(sources).filter(
      ([_, price]) => price !== undefined,
    );

    if (availableSources.length === 0) {
      return null;
    }

    // If only one source, use it
    if (availableSources.length === 1) {
      return {
        price: availableSources[0][1]!,
        sources,
        confidence: 0.5, // Low confidence with single source
        timestamp: Date.now(),
      };
    }

    // Aggregate multiple sources
    const prices = availableSources.map(([_, p]) => p!);

    // Check deviation between sources
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const deviation = ((maxPrice - minPrice) / minPrice) * 10000; // in basis points

    if (deviation > this.MAX_DEVIATION_BP) {
      this.logger.error(
        `Price deviation too high for ${tokenMint}: ${deviation} bp (max: ${this.MAX_DEVIATION_BP})`,
      );
      throw new Error('Price sources have too much deviation');
    }

    // Use median price for robustness
    const medianPrice = this.calculateMedian(prices);

    return {
      price: medianPrice,
      sources,
      confidence: availableSources.length >= 2 ? 0.9 : 0.7,
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate boost value in USD
   */
  async calculateBoostValue(
    tokenMint: string,
    amount: bigint,
  ): Promise<bigint> {
    const pricePerToken = await this.getTokenPrice(tokenMint);
    // amount is in token's native decimals, price is in micro-USD
    // result should be in micro-USD
    return (amount * pricePerToken) / BigInt(1_000000);
  }

  /**
   * Calculate median of array
   */
  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return sorted[mid];
  }

  /**
   * Get cached price from database
   */
  private async getCachedPrice(tokenMint: string): Promise<bigint | null> {
    const cached = await this.prisma.tokenPrice.findUnique({
      where: { token_mint: tokenMint },
    });

    if (!cached) {
      return null;
    }

    // Check if cache is stale (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (cached.updated_at < fiveMinutesAgo) {
      this.logger.warn(`Cached price for ${tokenMint} is stale`);
      return null;
    }

    return cached.price_usd;
  }

  /**
   * Update cached price in database
   */
  private async updateCachedPrice(tokenMint: string, priceUsd: bigint) {
    await this.prisma.tokenPrice.upsert({
      where: { token_mint: tokenMint },
      create: {
        token_mint: tokenMint,
        price_usd: priceUsd,
        source: 'aggregated',
      },
      update: {
        price_usd: priceUsd,
        source: 'aggregated',
        updated_at: new Date(),
      },
    });
  }

  /**
   * Get all tracked token prices
   */
  async getAllPrices(): Promise<
    Array<{
      tokenMint: string;
      priceUsd: bigint;
      source: string;
      updatedAt: Date;
    }>
  > {
    const prices = await this.prisma.tokenPrice.findMany({
      orderBy: { updated_at: 'desc' },
    });

    return prices.map((p) => ({
      tokenMint: p.token_mint,
      priceUsd: p.price_usd,
      source: p.source,
      updatedAt: p.updated_at,
    }));
  }

  /**
   * Alias for getAggregatedPrice (used by controllers)
   */
  async getPrice(tokenMint: string): Promise<AggregatedPrice | null> {
    return this.getAggregatedPrice(tokenMint);
  }

  /**
   * Get list of supported tokens
   * Returns token mints that have cached prices or are configured
   */
  async getSupportedTokens(): Promise<string[]> {
    try {
      // Get all tokens from cache/database
      const cachedPrices = await this.prisma.tokenPrice.findMany({
        select: { token_mint: true },
      });

      const tokens = cachedPrices.map((p) => p.token_mint);

      // Add commonly used tokens if not in cache
      const commonTokens = [
        'So11111111111111111111111111111111111111112', // SOL
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
      ];

      const uniqueTokens = [...new Set([...tokens, ...commonTokens])];
      return uniqueTokens;
    } catch (error) {
      this.logger.error('Failed to get supported tokens', error);
      // Return fallback list
      return [
        'So11111111111111111111111111111111111111112',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      ];
    }
  }
}
