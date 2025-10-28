import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { PriceServiceConnection } from '@pythnetwork/price-service-client';

export interface PythPrice {
  price: number;
  confidence: number;
  expo: number;
  publishTime: number;
}

@Injectable()
export class PythOracleService {
  private readonly logger = new Logger(PythOracleService.name);
  private connection: Connection;
  private priceService: PriceServiceConnection;

  // Pyth price feed IDs (mainnet examples - update for your tokens)
  private readonly priceFeedIds = {
    // SOL/USD
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    // USDT/USD
    USDT: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
    // Add your boost token IDs here
  };

  constructor() {
    const rpcUrl =
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');

    // Hermes price service (Pyth's data delivery network)
    const pythPriceServiceUrl =
      process.env.PYTH_PRICE_SERVICE_URL || 'https://hermes.pyth.network';
    this.priceService = new PriceServiceConnection(pythPriceServiceUrl, {
      logger: {
        error: (...args) => this.logger.error(...args),
        warn: (...args) => this.logger.warn(...args),
        info: (...args) => this.logger.log(...args),
        debug: (...args) => this.logger.debug(...args),
      },
    });
  }

  /**
   * Get price for a token from Pyth
   */
  async getPrice(tokenSymbol: string): Promise<PythPrice | null> {
    try {
      const priceFeedId = this.priceFeedIds[tokenSymbol.toUpperCase()];

      if (!priceFeedId) {
        this.logger.warn(`No Pyth price feed ID configured for ${tokenSymbol}`);
        return null;
      }

      // Get latest price feeds
      const priceFeeds = await this.priceService.getLatestPriceFeeds([
        priceFeedId,
      ]);

      if (!priceFeeds || priceFeeds.length === 0) {
        this.logger.warn(`No price data from Pyth for ${tokenSymbol}`);
        return null;
      }

      const priceFeed = priceFeeds[0];
      const price = priceFeed.getPriceUnchecked();

      return {
        price: Number(price.price) * Math.pow(10, price.expo),
        confidence: Number(price.conf) * Math.pow(10, price.expo),
        expo: price.expo,
        publishTime: price.publishTime,
      };
    } catch (error) {
      this.logger.error(`Failed to get Pyth price for ${tokenSymbol}`, error);
      return null;
    }
  }

  /**
   * Get prices for multiple tokens
   */
  async getPrices(tokenSymbols: string[]): Promise<Map<string, PythPrice>> {
    const prices = new Map<string, PythPrice>();

    const priceFeedIds = tokenSymbols
      .map((symbol) => this.priceFeedIds[symbol.toUpperCase()])
      .filter((id) => id !== undefined);

    if (priceFeedIds.length === 0) {
      return prices;
    }

    try {
      const priceFeeds =
        await this.priceService.getLatestPriceFeeds(priceFeedIds);

      for (let i = 0; i < tokenSymbols.length; i++) {
        const symbol = tokenSymbols[i];
        const priceFeed = priceFeeds[i];

        if (priceFeed) {
          const price = priceFeed.getPriceUnchecked();
          prices.set(symbol, {
            price: Number(price.price) * Math.pow(10, price.expo),
            confidence: Number(price.conf) * Math.pow(10, price.expo),
            expo: price.expo,
            publishTime: price.publishTime,
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to get Pyth prices', error);
    }

    return prices;
  }

  /**
   * Check if price is stale (older than maxAge seconds)
   */
  isPriceStale(pythPrice: PythPrice, maxAgeSeconds: number = 60): boolean {
    const now = Math.floor(Date.now() / 1000);
    const age = now - pythPrice.publishTime;
    return age > maxAgeSeconds;
  }

  /**
   * Get price with confidence check
   */
  async getPriceWithConfidence(
    tokenSymbol: string,
    maxConfidencePercent: number = 1.0,
  ): Promise<PythPrice | null> {
    const price = await this.getPrice(tokenSymbol);

    if (!price) {
      return null;
    }

    // Check confidence interval
    const confidencePercent = (price.confidence / price.price) * 100;
    if (confidencePercent > maxConfidencePercent) {
      this.logger.warn(
        `Pyth price confidence too low for ${tokenSymbol}: ${confidencePercent.toFixed(2)}%`,
      );
      return null;
    }

    // Check staleness
    if (this.isPriceStale(price)) {
      this.logger.warn(`Pyth price is stale for ${tokenSymbol}`);
      return null;
    }

    return price;
  }

  /**
   * Register custom price feed ID
   */
  registerPriceFeedId(tokenSymbol: string, priceFeedId: string) {
    this.priceFeedIds[tokenSymbol.toUpperCase()] = priceFeedId;
    this.logger.log(
      `Registered Pyth price feed for ${tokenSymbol}: ${priceFeedId}`,
    );
  }
}
