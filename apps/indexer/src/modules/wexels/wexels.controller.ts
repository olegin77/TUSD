import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WexelsService } from './wexels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class ClaimRewardsDto {
  amount: string; // BigInt as string
  txHash?: string;
}

export class CollateralizeDto {
  wexelId: string; // BigInt as string
}

export class RepayLoanDto {
  wexelId: string; // BigInt as string
  amount: string; // BigInt as string
}

@Controller('wexels')
export class WexelsController {
  constructor(private readonly wexelsService: WexelsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findByOwner(@Request() req) {
    const address = req.user.solanaAddress || req.user.tronAddress;
    return this.wexelsService.findByOwner(address);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wexelsService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/rewards')
  calculateRewards(@Param('id') id: string) {
    return this.wexelsService.calculateRewards(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  claimRewards(
    @Param('id') id: string,
    @Body() claimRewardsDto: ClaimRewardsDto,
  ) {
    return this.wexelsService.claimRewards(
      BigInt(id),
      BigInt(claimRewardsDto.amount),
      claimRewardsDto.txHash,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('collateralize')
  collateralize(@Body() collateralizeDto: CollateralizeDto) {
    return this.wexelsService.collateralize(BigInt(collateralizeDto.wexelId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('repay-loan')
  repayLoan(@Body() repayLoanDto: RepayLoanDto) {
    return this.wexelsService.repayLoan(
      BigInt(repayLoanDto.wexelId),
      BigInt(repayLoanDto.amount),
    );
  }
}
