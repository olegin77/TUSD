import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CollateralService } from './collateral.service';
import { OpenCollateralDto } from './dto/open-collateral.dto';
import { RepayLoanDto } from './dto/repay-loan.dto';

@Controller('api/v1/collateral')
export class CollateralController {
  constructor(private readonly collateralService: CollateralService) {}

  /**
   * POST /api/v1/collateral/:id/open
   * Open collateral position (pledge wexel, get loan)
   */
  @Post(':id/open')
  async open(
    @Param('id', ParseIntPipe) wexelId: number,
    @Body() openCollateralDto: OpenCollateralDto,
  ) {
    try {
      const position = await this.collateralService.open(wexelId, openCollateralDto);
      return {
        success: true,
        data: position,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to open collateral position',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /api/v1/collateral/:id/repay
   * Repay loan and release wexel from collateral
   */
  @Post(':id/repay')
  async repay(
    @Param('id', ParseIntPipe) wexelId: number,
    @Body() repayLoanDto: RepayLoanDto,
  ) {
    try {
      const result = await this.collateralService.repay(wexelId, repayLoanDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to repay loan',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * GET /api/v1/collateral/:id
   * Get collateral position details
   */
  @Get(':id')
  async getPosition(@Param('id', ParseIntPipe) wexelId: number) {
    try {
      const position = await this.collateralService.getPosition(wexelId);
      if (!position) {
        throw new HttpException('Collateral position not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: position,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to fetch collateral position',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/v1/collateral/:id/calculate
   * Calculate potential loan amount for a wexel
   */
  @Get(':id/calculate')
  async calculateLoan(@Param('id', ParseIntPipe) wexelId: number) {
    try {
      const calculation = await this.collateralService.calculateLoan(wexelId);
      return {
        success: true,
        data: calculation,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to calculate loan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
