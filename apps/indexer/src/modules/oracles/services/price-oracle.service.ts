import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import axios from 'axios';

export interface PriceData {
  tokenMint: string;
  priceUsd: number;
  source: string;
  timestamp: number;
  confidence?: number;
}

export interface OracleSource {
  name: string;
  getPrice: (tokenMint: string) => Promise<PriceData | null>;
  isAvailable: () => Promise<boolean>;
}

@Injectable()
export class PriceOracleService {
  private readonly logger = new Logger(PriceOracleService.name);
  private readonly sources: OracleSource[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.initializeSources();
  }

  private initializeSources() {
    // Pyth Network
    this.sources.push({
      name: 'pyth',
      getPrice: this.getPythPrice.bind(this),
      isAvailable: this.isPythAvailable.bind(this),
    });

    // CoinGecko
    this.sources.push({
      name: 'coingecko',
      getPrice: this.getCoinGeckoPrice.bind(this),
      isAvailable: this.isCoinGeckoAvailable.bind(this),
    });

    // Binance
    this.sources.push({
      name: 'binance',
      getPrice: this.getBinancePrice.bind(this),
      isAvailable: this.isBinanceAvailable.bind(this),
    });

    // Jupiter API (Solana DEX aggregator)
    this.sources.push({
      name: 'jupiter',
      getPrice: this.getJupiterPrice.bind(this),
      isAvailable: this.isJupiterAvailable.bind(this),
    });
  }

  async getPrice(tokenMint: string): Promise<PriceData | null> {
    try {
      // First, try to get cached price
      const cachedPrice = await this.getCachedPrice(tokenMint);
      if (cachedPrice && this.isPriceFresh(cachedPrice.timestamp)) {
        return cachedPrice;
      }

      // Get prices from all available sources
      const prices: PriceData[] = [];

      for (const source of this.sources) {
        try {
          if (await source.isAvailable()) {
            const price = await source.getPrice(tokenMint);
            if (price) {
              prices.push(price);
            }
          }
        } catch (error) {
          this.logger.warn(
            `Failed to get price from ${source.name}: ${error.message}`,
          );
        }
      }

      if (prices.length === 0) {
        this.logger.warn(`No price data available for token ${tokenMint}`);
        return null;
      }

      // Calculate median price
      const medianPrice = this.calculateMedianPrice(prices);

      // Validate price deviation
      if (!this.validatePriceDeviation(prices, medianPrice)) {
        this.logger.warn(`Price deviation too high for token ${tokenMint}`);
        return null;
      }

      // Cache the price
      await this.cachePrice(medianPrice);

      return medianPrice;
    } catch (error) {
      this.logger.error(
        `Failed to get price for token ${tokenMint}: ${error.message}`,
      );
      return null;
    }
  }

  private async getCachedPrice(tokenMint: string): Promise<PriceData | null> {
    try {
      const cached = await this.prisma.tokenPrice.findUnique({
        where: { token_mint: tokenMint },
      });

      if (cached) {
        return {
          tokenMint: cached.token_mint,
          priceUsd: Number(cached.price_usd) / 1000000, // Convert from micro-units
          source: cached.source,
          timestamp: cached.updated_at.getTime(),
        };
      }
    } catch (error) {
      this.logger.warn(`Failed to get cached price: ${error.message}`);
    }
    return null;
  }

  private isPriceFresh(timestamp: number): boolean {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    return now - timestamp < maxAge;
  }

  private async cachePrice(priceData: PriceData): Promise<void> {
    try {
      await this.prisma.tokenPrice.upsert({
        where: { token_mint: priceData.tokenMint },
        update: {
          price_usd: BigInt(Math.round(priceData.priceUsd * 1000000)), // Convert to micro-units
          source: priceData.source,
          updated_at: new Date(),
        },
        create: {
          token_mint: priceData.tokenMint,
          price_usd: BigInt(Math.round(priceData.priceUsd * 1000000)),
          source: priceData.source,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to cache price: ${error.message}`);
    }
  }

  private calculateMedianPrice(prices: PriceData[]): PriceData {
    if (prices.length === 1) {
      return prices[0];
    }

    // Sort by price
    const sortedPrices = prices.sort((a, b) => a.priceUsd - b.priceUsd);
    const mid = Math.floor(sortedPrices.length / 2);

    if (sortedPrices.length % 2 === 0) {
      // Even number of prices - average the two middle values
      const avgPrice =
        (sortedPrices[mid - 1].priceUsd + sortedPrices[mid].priceUsd) / 2;
      return {
        ...sortedPrices[mid],
        priceUsd: avgPrice,
        source: 'aggregated',
      };
    } else {
      // Odd number of prices - return the middle value
      return sortedPrices[mid];
    }
  }

  private validatePriceDeviation(
    prices: PriceData[],
    medianPrice: PriceData,
  ): boolean {
    const maxDeviation = 0.15; // 15% maximum deviation

    for (const price of prices) {
      const deviation =
        Math.abs(price.priceUsd - medianPrice.priceUsd) / medianPrice.priceUsd;
      if (deviation > maxDeviation) {
        return false;
      }
    }

    return true;
  }

  // Pyth Network implementation
  private async getPythPrice(tokenMint: string): Promise<PriceData | null> {
    try {
      // This is a simplified implementation
      // In production, you would use the Pyth SDK
      const response = await axios.get(
        `https://hermes.pyth.network/v2/price_feeds/latest?ids[]=${tokenMint}`,
      );

      if (response.data && response.data.length > 0) {
        const priceData = response.data[0];
        return {
          tokenMint,
          priceUsd: priceData.price.price,
          source: 'pyth',
          timestamp: Date.now(),
          confidence: priceData.price.conf,
        };
      }
    } catch (error) {
      this.logger.warn(`Pyth price fetch failed: ${error.message}`);
    }
    return null;
  }

  private async isPythAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(
        'https://hermes.pyth.network/v2/price_feeds/latest?ids[]=SOL',
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // CoinGecko implementation
  private async getCoinGeckoPrice(
    tokenMint: string,
  ): Promise<PriceData | null> {
    try {
      // Map token mints to CoinGecko IDs
      const tokenMap: Record<string, string> = {
        So11111111111111111111111111111111111111112: 'solana', // SOL
        EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 'usd-coin', // USDC
        Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 'tether', // USDT
      };

      const coingeckoId = tokenMap[tokenMint];
      if (!coingeckoId) {
        return null;
      }

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      );

      if (response.data && response.data[coingeckoId]) {
        return {
          tokenMint,
          priceUsd: response.data[coingeckoId].usd,
          source: 'coingecko',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      this.logger.warn(`CoinGecko price fetch failed: ${error.message}`);
    }
    return null;
  }

  private async isCoinGeckoAvailable(): Promise<boolean> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/ping');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Binance implementation
  private async getBinancePrice(tokenMint: string): Promise<PriceData | null> {
    try {
      // Map token mints to Binance symbols
      const tokenMap: Record<string, string> = {
        So11111111111111111111111111111111111111112: 'SOLUSDT', // SOL
        EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 'USDCUSDT', // USDC
        Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 'USDTUSDT', // USDT
      };

      const symbol = tokenMap[tokenMint];
      if (!symbol) {
        return null;
      }

      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
      );

      if (response.data && response.data.price) {
        return {
          tokenMint,
          priceUsd: parseFloat(response.data.price),
          source: 'binance',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      this.logger.warn(`Binance price fetch failed: ${error.message}`);
    }
    return null;
  }

  private async isBinanceAvailable(): Promise<boolean> {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ping');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Jupiter API implementation
  private async getJupiterPrice(tokenMint: string): Promise<PriceData | null> {
    try {
      const response = await axios.get(
        `https://price.jup.ag/v4/price?ids=${tokenMint}`,
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data[tokenMint]
      ) {
        const priceData = response.data.data[tokenMint];
        return {
          tokenMint,
          priceUsd: priceData.price,
          source: 'jupiter',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      this.logger.warn(`Jupiter price fetch failed: ${error.message}`);
    }
    return null;
  }

  private async isJupiterAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(
        'https://price.jup.ag/v4/price?ids=So11111111111111111111111111111111111111112',
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async getSupportedTokens(): Promise<string[]> {
    return [
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    ];
  }
}
