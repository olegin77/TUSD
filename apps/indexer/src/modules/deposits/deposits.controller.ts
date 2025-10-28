import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ConfirmDepositDto } from './dto/confirm-deposit.dto';
import { ApplyBoostToDepositDto } from './dto/apply-boost-to-deposit.dto';

@Controller('api/v1/deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  /**
   * POST /api/v1/deposits
   * Initialize a new deposit (reserve ID)
   */
  @Post()
  async create(@Body() createDepositDto: CreateDepositDto) {
    try {
      const deposit = await this.depositsService.create(createDepositDto);
      return {
        success: true,
        data: deposit,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create deposit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/deposits/:id/confirm
   * Finalize deposit after on-chain tx confirmation
   */
  @Post(':id/confirm')
  async confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() confirmDepositDto: ConfirmDepositDto,
  ) {
    try {
      const deposit = await this.depositsService.confirm(id, confirmDepositDto);
      return {
        success: true,
        data: deposit,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to confirm deposit',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /api/v1/deposits/:id/boost
   * Apply boost to a deposit
   */
  @Post(':id/boost')
  async applyBoost(
    @Param('id', ParseIntPipe) id: number,
    @Body() applyBoostDto: ApplyBoostToDepositDto,
  ) {
    try {
      const result = await this.depositsService.applyBoost(id, applyBoostDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to apply boost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * GET /api/v1/deposits
   * Get all deposits for a user
   */
  @Get()
  async findAll(@Query('userAddress') userAddress?: string) {
    try {
      const deposits = await this.depositsService.findAll(userAddress);
      return {
        success: true,
        data: deposits,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch deposits',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/v1/deposits/:id
   * Get specific deposit details
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const deposit = await this.depositsService.findOne(id);
      if (!deposit) {
        throw new HttpException('Deposit not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: deposit,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to fetch deposit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
