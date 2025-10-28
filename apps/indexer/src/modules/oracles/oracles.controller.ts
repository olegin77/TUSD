import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PriceOracleService } from './services/price-oracle.service';

@Controller('oracles')
export class OraclesController {
  constructor(private readonly priceOracleService: PriceOracleService) {}

  @Get('price')
  async getPrice(@Query('mint') mint: string) {
    if (!mint) {
      throw new HttpException(
        'Token mint address is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const price = await this.priceOracleService.getPrice(mint);

      if (!price) {
        throw new HttpException(
          'Price not available for this token',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: {
          tokenMint: mint,
          priceUsd: price.price,
          sources: price.sources,
          timestamp: price.timestamp,
          confidence: price.confidence,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch price data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tokens')
  async getSupportedTokens() {
    try {
      const tokens = await this.priceOracleService.getSupportedTokens();

      return {
        success: true,
        data: {
          tokens,
          count: tokens.length,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch supported tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async getHealth() {
    try {
      const tokens = await this.priceOracleService.getSupportedTokens();
      const healthChecks = await Promise.allSettled(
        tokens
          .slice(0, 3)
          .map((token) => this.priceOracleService.getPrice(token)),
      );

      const availableSources = healthChecks.filter(
        (result) => result.status === 'fulfilled' && result.value !== null,
      ).length;

      return {
        success: true,
        data: {
          status: 'healthy',
          availableSources,
          totalTokens: tokens.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
