import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OraclesService } from './oracles.service';

export class UpdatePriceDto {
  tokenMint: string;
  priceUsd: string; // BigInt as string
  source: string;
}

export class CalculateBoostDto {
  tokenMint: string;
  amount: string; // BigInt as string
}

@Controller('oracles')
export class OraclesController {
  constructor(private readonly oraclesService: OraclesService) {}

  @Get('prices')
  getAllPrices() {
    return this.oraclesService.getAllPrices();
  }

  @Get('prices/:tokenMint')
  getPrice(@Param('tokenMint') tokenMint: string) {
    return this.oraclesService.getPrice(tokenMint);
  }

  @Post('prices')
  updatePrice(@Body() updatePriceDto: UpdatePriceDto) {
    return this.oraclesService.updatePrice(
      updatePriceDto.tokenMint,
      BigInt(updatePriceDto.priceUsd),
      updatePriceDto.source,
    );
  }

  @Post('calculate-boost')
  calculateBoost(@Body() calculateBoostDto: CalculateBoostDto) {
    return this.oraclesService.calculateBoostValue(
      calculateBoostDto.tokenMint,
      BigInt(calculateBoostDto.amount),
    );
  }
}
