import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LaikaPriceService } from './services/laika-price.service';
import { TakaraMiningService } from './services/takara-mining.service';
import { YieldCalculatorService } from './services/yield-calculator.service';
// PayoutFrequency enum - matches Prisma schema
enum PayoutFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

@ApiTags('takara')
@Controller('api/v1/takara')
export class TakaraController {
  constructor(
    private readonly laikaPriceService: LaikaPriceService,
    private readonly takaraMiningService: TakaraMiningService,
    private readonly yieldCalculatorService: YieldCalculatorService,
  ) {}

  // ============================================
  // Laika Price Endpoints
  // ============================================

  @Get('laika/price')
  @ApiOperation({ summary: 'Get current Laika price' })
  @ApiResponse({ status: 200, description: 'Laika price data with discount' })
  async getLaikaPrice() {
    const price = await this.laikaPriceService.getLaikaPrice();
    return {
      success: true,
      data: {
        marketPrice: price.marketPrice,
        discountedPrice: price.discountedPrice,
        discountPercent: 15,
        updatedAt: price.updatedAt,
      },
    };
  }

  @Post('laika/check-boost')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if Laika balance qualifies for boost' })
  @ApiResponse({ status: 200, description: 'Boost eligibility result' })
  async checkBoostEligibility(
    @Body() body: { laikaBalance: number; depositAmountUsd: number },
  ) {
    const result = await this.laikaPriceService.checkBoostEligibility(
      body.laikaBalance,
      body.depositAmountUsd,
    );
    return {
      success: true,
      data: result,
    };
  }

  // ============================================
  // Takara Mining Endpoints
  // ============================================

  @Get('mining/stats')
  @ApiOperation({ summary: 'Get Takara mining statistics' })
  @ApiResponse({ status: 200, description: 'Mining pool statistics' })
  async getMiningStats() {
    const stats = await this.takaraMiningService.getMiningStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Get('mining/config')
  @ApiOperation({ summary: 'Get Takara token configuration' })
  @ApiResponse({ status: 200, description: 'Takara configuration' })
  async getTakaraConfig() {
    const config = await this.takaraMiningService.getConfig();
    return {
      success: true,
      data: config,
    };
  }

  @Post('mining/initialize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initialize Takara configuration (admin only)' })
  @ApiResponse({ status: 200, description: 'Configuration initialized' })
  async initializeConfig(
    @Body()
    body: {
      internalPriceUsd: number;
      totalSupply: number;
      tokenMintAddress?: string;
      miningVaultAddress?: string;
      adminWalletAddress?: string;
    },
  ): Promise<{ success: boolean; data: any }> {
    const config = await this.takaraMiningService.initializeConfig(body);
    return {
      success: true,
      data: config,
    };
  }

  @Post('mining/calculate-reward')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate daily Takara reward for deposit' })
  @ApiResponse({ status: 200, description: 'Calculated reward' })
  async calculateDailyReward(
    @Body() body: { depositAmountUsd: number; poolTakaraApr: number },
  ) {
    const reward = await this.takaraMiningService.calculateDailyTakaraReward(
      body.depositAmountUsd,
      body.poolTakaraApr,
    );
    return {
      success: true,
      data: reward,
    };
  }

  @Post('mining/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process Takara claim for deposit' })
  @ApiResponse({ status: 200, description: 'Claim processed' })
  async processClaim(
    @Body()
    body: {
      depositId: string;
      userSolanaAddress: string;
      claimAmount?: number;
    },
  ) {
    const result = await this.takaraMiningService.processClaim(
      BigInt(body.depositId),
      body.userSolanaAddress,
      body.claimAmount,
    );
    return {
      success: true,
      data: {
        claimId: result.claimId.toString(),
        amount: result.amount,
        status: result.status,
      },
    };
  }

  @Post('mining/confirm-claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm Takara claim with tx hash' })
  @ApiResponse({ status: 200, description: 'Claim confirmed' })
  async confirmClaim(
    @Body() body: { claimId: string; txHash: string },
  ): Promise<{ success: boolean; data: any }> {
    const result = await this.takaraMiningService.confirmClaim(
      BigInt(body.claimId),
      body.txHash,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Get('mining/claims/:userAddress')
  @ApiOperation({ summary: 'Get claim history for user' })
  @ApiResponse({ status: 200, description: 'Claim history' })
  async getClaimHistory(@Param('userAddress') userAddress: string) {
    const claims = await this.takaraMiningService.getClaimHistory(userAddress);
    return {
      success: true,
      data: claims.map((c) => ({
        ...c,
        id: c.id.toString(),
        deposit_id: c.deposit_id.toString(),
        amount: Number(c.amount),
        price_at_claim: Number(c.price_at_claim),
      })),
    };
  }

  // ============================================
  // Yield Calculator Endpoints
  // ============================================

  @Post('yield/calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate total yield for deposit' })
  @ApiResponse({ status: 200, description: 'Yield calculation' })
  async calculateYield(
    @Body()
    body: {
      depositId: string;
      depositAmountUsd: number;
      poolId: number;
      payoutFrequency: PayoutFrequency;
      laikaBalance?: number;
      solanaWallet?: string;
    },
  ) {
    const result = await this.yieldCalculatorService.calculateTotalYield({
      depositId: BigInt(body.depositId),
      depositAmountUsd: body.depositAmountUsd,
      poolId: body.poolId,
      payoutFrequency: body.payoutFrequency,
      laikaBalance: body.laikaBalance,
      solanaWallet: body.solanaWallet,
    });
    return {
      success: true,
      data: result,
    };
  }

  @Post('yield/simulate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simulate yield for potential deposit' })
  @ApiResponse({ status: 200, description: 'Yield simulation' })
  async simulateYield(
    @Body()
    body: {
      depositAmountUsd: number;
      poolId: number;
      payoutFrequency: PayoutFrequency;
      laikaBalance?: number;
    },
  ) {
    const result = await this.yieldCalculatorService.simulateYield({
      depositAmountUsd: body.depositAmountUsd,
      poolId: body.poolId,
      payoutFrequency: body.payoutFrequency,
      laikaBalance: body.laikaBalance,
    });
    return {
      success: true,
      data: result,
    };
  }

  @Get('yield/pools')
  @ApiOperation({ summary: 'Get yield summary for all pools' })
  @ApiResponse({ status: 200, description: 'Pool yield summary' })
  async getPoolYieldSummary() {
    const summary = await this.yieldCalculatorService.getPoolYieldSummary();
    return {
      success: true,
      data: summary,
    };
  }

  @Post('yield/period')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate rewards for specific period' })
  @ApiResponse({ status: 200, description: 'Period rewards' })
  async calculatePeriodRewards(
    @Body()
    body: {
      depositId: string;
      depositAmountUsd: number;
      poolId: number;
      payoutFrequency: PayoutFrequency;
      startDate: string;
      endDate: string;
      isLaikaBoostActive: boolean;
    },
  ) {
    const result = await this.yieldCalculatorService.calculatePeriodRewards({
      depositId: BigInt(body.depositId),
      depositAmountUsd: body.depositAmountUsd,
      poolId: body.poolId,
      payoutFrequency: body.payoutFrequency,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isLaikaBoostActive: body.isLaikaBoostActive,
    });
    return {
      success: true,
      data: result,
    };
  }

  @Post('yield/update-boost/:depositId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update deposit Laika boost status' })
  @ApiResponse({ status: 200, description: 'Boost status updated' })
  async updateBoostStatus(
    @Param('depositId') depositId: string,
    @Body() body: { laikaBalance: number },
  ) {
    const result = await this.yieldCalculatorService.updateDepositBoostStatus(
      BigInt(depositId),
      body.laikaBalance,
    );
    return {
      success: true,
      data: result,
    };
  }
}
