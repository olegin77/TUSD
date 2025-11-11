import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PriceOracleService } from './services/price-oracle.service';

/**
 * MEDIUM-03 FIX: Rate limiting applied to all oracle endpoints
 */
@ApiTags('oracles')
@Controller('oracles')
export class OraclesController {
  constructor(private readonly priceOracleService: PriceOracleService) {}

  /**
   * Get price for a token
   * Rate limit: 100 requests per minute (public endpoint)
   */
  @Get('price')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get token price',
    description: 'Retrieve current USD price for a token from oracle aggregator',
  })
  @ApiQuery({
    name: 'mint',
    required: true,
    description: 'Token mint address (Solana) or contract address (Tron)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Price retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          tokenMint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          priceUsd: 1.0005,
          sources: ['Pyth', 'Chainlink'],
          timestamp: '2025-01-15T10:00:00.000Z',
          confidence: 0.98,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token mint address is required' })
  @ApiResponse({ status: 404, description: 'Price not available for this token' })
  @ApiResponse({ status: 429, description: 'Too many requests - Rate limit exceeded' })
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

  /**
   * Get list of supported tokens
   * Rate limit: 60 requests per minute
   */
  @Get('tokens')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get supported tokens',
    description: 'Retrieve list of all tokens supported by the oracle system',
  })
  @ApiResponse({
    status: 200,
    description: 'Supported tokens retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          tokens: [
            'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          ],
          count: 3,
        },
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too many requests - Rate limit exceeded' })
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

  /**
   * Oracle health check
   * Rate limit: 30 requests per minute
   */
  @Get('health')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary: 'Oracle health check',
    description: 'Check the health status of oracle data sources',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved',
    schema: {
      example: {
        success: true,
        data: {
          status: 'healthy',
          availableSources: 2,
          totalTokens: 3,
          timestamp: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too many requests - Rate limit exceeded' })
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
