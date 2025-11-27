import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { YieldCalculatorService } from './yield-calculator.service';
import { PayoutFrequency } from '@prisma/client';

/**
 * YieldController - Yield calculation endpoints
 * Master v6 compliant APY calculations with frequency multipliers
 */
@ApiTags('yield')
@Controller('api/v1/yield')
export class YieldController {
  constructor(private readonly yieldCalculator: YieldCalculatorService) {}

  @Get('vaults')
  @ApiOperation({
    summary: 'Get all vault APY configurations',
    description: 'Returns APY configurations for all vaults per Master v6 spec',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault configurations retrieved successfully',
    schema: {
      example: {
        VAULT_1: {
          baseApyBps: 700,
          boostApyBps: 140,
          maxApyBps: 840,
          takaraAprBps: 3000,
          boostToken: 'LAIKA',
          boostRatio: 0.4,
          boostDiscount: 0.15,
        },
        VAULT_2: {
          baseApyBps: 700,
          boostApyBps: 600,
          maxApyBps: 1300,
          takaraAprBps: 3000,
          boostToken: 'TAKARA',
          boostRatio: 1.0,
          boostFixedPrice: 0.1,
        },
        VAULT_3: {
          baseApyBps: 800,
          boostApyBps: 700,
          maxApyBps: 1500,
          takaraAprBps: 4000,
          boostToken: 'TAKARA',
          boostRatio: 1.0,
          boostFixedPrice: 0.1,
        },
      },
    },
  })
  getAllVaultConfigs() {
    return this.yieldCalculator.getAllVaultConfigs();
  }

  @Get('vaults/:vaultType')
  @ApiOperation({
    summary: 'Get APY variants for a specific vault',
    description:
      'Calculate all APY variants (monthly/quarterly/yearly) for a vault',
  })
  @ApiQuery({ name: 'hasBoost', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'APY variants calculated successfully',
  })
  getVaultApyVariants(
    @Param('vaultType') vaultType: 'VAULT_1' | 'VAULT_2' | 'VAULT_3',
    @Query('hasBoost') hasBoost?: string,
  ) {
    const boost = hasBoost === 'true' || hasBoost === '1';
    return this.yieldCalculator.calculateVaultApyVariants(vaultType, boost);
  }

  @Post('calculate')
  @ApiOperation({
    summary: 'Calculate complete deposit projection',
    description:
      'Calculate full yield projection including USDT rewards, Takara mining, and boost requirements',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        depositAmountUsd: { type: 'number', example: 1000 },
        vaultType: {
          type: 'string',
          enum: ['VAULT_1', 'VAULT_2', 'VAULT_3'],
          example: 'VAULT_1',
        },
        frequency: {
          type: 'string',
          enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
          example: 'MONTHLY',
        },
        durationMonths: { type: 'number', example: 12 },
        hasBoost: { type: 'boolean', example: true },
        boostTokenMarketPrice: { type: 'number', example: 0.12 },
        takaraPriceUsd: { type: 'number', example: 0.1 },
      },
      required: [
        'depositAmountUsd',
        'vaultType',
        'frequency',
        'durationMonths',
        'hasBoost',
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Deposit projection calculated',
    schema: {
      example: {
        deposit: {
          amountUsd: 1000,
          vaultType: 'VAULT_1',
          frequency: 'MONTHLY',
          durationMonths: 12,
          hasBoost: true,
        },
        apy: {
          baseApyPercent: 7,
          boostApyPercent: 1.4,
          totalApyPercent: 8.4,
          apyMonthly: 8.4,
          apyQuarterly: 9.66,
          apyYearly: 10.92,
        },
        usdtYield: {
          effectiveApyPercent: 8.4,
          yearlyYieldUsd: 84,
          monthlyYieldUsd: 7,
          totalYieldUsd: 84,
          payoutsCount: 12,
          yieldPerPayoutUsd: 7,
          finalAmountUsd: 1084,
        },
        takaraRewards: {
          takaraAprPercent: 30,
          yearlyRewardUsd: 300,
          totalRewardUsd: 300,
          takaraTokensEarned: 3000,
        },
        boostRequirement: {
          boostToken: 'LAIKA',
          requiredValueUsd: 400,
          tokensRequired: 3921.57,
        },
        summary: {
          totalUsdtYield: 84,
          totalTakaraTokens: 3000,
          totalTakaraValueUsd: 300,
          finalPrincipalReturn: 1000,
          totalValueAtEnd: 1384,
        },
      },
    },
  })
  calculateProjection(
    @Body()
    body: {
      depositAmountUsd: number;
      vaultType: 'VAULT_1' | 'VAULT_2' | 'VAULT_3';
      frequency: PayoutFrequency;
      durationMonths: number;
      hasBoost: boolean;
      boostTokenMarketPrice?: number;
      takaraPriceUsd?: number;
    },
  ) {
    return this.yieldCalculator.calculateDepositProjection(body);
  }

  @Post('boost-requirement')
  @ApiOperation({
    summary: 'Calculate boost token requirement',
    description: 'Calculate how many boost tokens are needed for full APY',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        depositAmountUsd: { type: 'number', example: 1000 },
        vaultType: {
          type: 'string',
          enum: ['VAULT_1', 'VAULT_2', 'VAULT_3'],
          example: 'VAULT_1',
        },
        marketPriceUsd: { type: 'number', example: 0.12 },
      },
      required: ['depositAmountUsd', 'vaultType'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Boost requirement calculated',
  })
  calculateBoostRequirement(
    @Body()
    body: {
      depositAmountUsd: number;
      vaultType: 'VAULT_1' | 'VAULT_2' | 'VAULT_3';
      marketPriceUsd?: number;
    },
  ) {
    return this.yieldCalculator.calculateBoostRequirement(
      body.depositAmountUsd,
      body.vaultType,
      body.marketPriceUsd,
    );
  }
}
