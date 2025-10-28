import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { WexelsService } from './wexels.service';
import { BoostService } from './services/boost.service';
import { CreateWexelDto } from './dto/create-wexel.dto';
import { ApplyBoostDto } from './dto/apply-boost.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('api/v1/wexels')
export class WexelsController {
  constructor(
    private readonly wexelsService: WexelsService,
    private readonly boostService: BoostService,
  ) {}

  @Post()
  create(@Body() createWexelDto: CreateWexelDto) {
    return this.wexelsService.create(createWexelDto);
  }

  @Get()
  findAll() {
    return this.wexelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wexelsService.findOne(id.toString());
  }

  @Post('apply-boost')
  applyBoost(@Body() applyBoostDto: ApplyBoostDto) {
    return this.wexelsService.applyBoost(applyBoostDto);
  }

  @Get(':id/boost/calculate')
  async calculateBoost(
    @Param('id', ParseIntPipe) id: number,
    @Query('tokenMint') tokenMint: string,
    @Query('amount') amount: string,
  ) {
    if (!tokenMint || !amount) {
      throw new HttpException(
        'Token mint and amount are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.boostService.calculateBoost(
        BigInt(id),
        tokenMint,
        BigInt(amount),
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to calculate boost',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/boost/history')
  async getBoostHistory(@Param('id', ParseIntPipe) id: number) {
    try {
      const history = await this.boostService.getBoostHistory(BigInt(id));
      return {
        success: true,
        data: history,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get boost history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/boost/stats')
  async getBoostStats(@Param('id', ParseIntPipe) id: number) {
    try {
      const stats = await this.boostService.getBoostStats(BigInt(id));
      if (!stats) {
        throw new HttpException('Wexel not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get boost stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/boost/apply')
  async applyBoostToWexel(
    @Param('id', ParseIntPipe) id: number,
    @Body() applyBoostDto: ApplyBoostDto,
  ) {
    try {
      const boostApplication = {
        wexelId: BigInt(id),
        tokenMint: applyBoostDto.token_mint,
        amount: applyBoostDto.amount,
        priceUsd: applyBoostDto.priceUsd,
        valueUsd: applyBoostDto.valueUsd,
        apyBoostBp: applyBoostDto.apyBoostBp,
        txHash: applyBoostDto.txHash,
      };

      const success = await this.boostService.applyBoost(boostApplication);

      if (!success) {
        throw new HttpException(
          'Failed to apply boost',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Boost applied successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to apply boost',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('boost/validate-token')
  async validateBoostToken(@Query('tokenMint') tokenMint: string) {
    if (!tokenMint) {
      throw new HttpException('Token mint is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const isValid = await this.boostService.validateBoostToken(tokenMint);
      return {
        success: true,
        data: { isValid },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to validate token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWexelDto: Partial<CreateWexelDto>,
  ) {
    return this.wexelsService.update(id.toString(), updateWexelDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.wexelsService.remove(id.toString());
  }

  /**
   * GET /api/v1/wexels/:id/rewards
   * Calculate rewards for a wexel
   */
  @Get(':id/rewards')
  async calculateRewards(@Param('id', ParseIntPipe) id: number) {
    try {
      const rewards = await this.wexelsService.calculateRewards(id);
      return {
        success: true,
        data: rewards,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to calculate rewards',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/wexels/:id/claim
   * Claim rewards for a wexel (Protected)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  async claimRewards(
    @Param('id', ParseIntPipe) id: number,
    @Body('txHash') txHash: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    try {
      const result = await this.wexelsService.claimRewards(id, txHash);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to claim rewards',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
