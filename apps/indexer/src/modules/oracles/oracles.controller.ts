import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OraclesService } from './oracles.service';
import { PriceQueryDto } from './dto/price-query.dto';

@Controller('oracles')
export class OraclesController {
  constructor(private readonly oraclesService: OraclesService) {}

  @Get('price/:tokenMint')
  async getPrice(
    @Param('tokenMint') tokenMint: string,
    @Query('source') source?: string,
  ) {
    return this.oraclesService.getPrice(tokenMint, source);
  }

  @Post('price')
  async updatePrice(
    @Body() body: { tokenMint: string; priceUsd: number; source: string },
  ) {
    return this.oraclesService.updatePrice(
      body.tokenMint,
      body.priceUsd,
      body.source,
    );
  }

  @Get('prices')
  async getAllPrices() {
    return this.oraclesService.getAllPrices();
  }

  @Post('calculate-boost-apy')
  async calculateBoostApy(
    @Body()
    body: {
      baseApy: number;
      boostAmount: number;
      targetAmount: number;
    },
  ) {
    return {
      boostApy: await this.oraclesService.calculateBoostApy(
        body.baseApy,
        body.boostAmount,
        body.targetAmount,
      ),
    };
  }
}
