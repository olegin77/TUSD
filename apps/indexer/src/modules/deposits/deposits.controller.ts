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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ConfirmDepositDto } from './dto/confirm-deposit.dto';
import { ApplyBoostToDepositDto } from './dto/apply-boost-to-deposit.dto';

@ApiTags('deposits')
@Controller('api/v1/deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  /**
   * POST /api/v1/deposits
   * Initialize a new deposit (reserve ID)
   */
  @Post()
  @ApiOperation({
    summary: 'Create new deposit',
    description:
      'Initialize a new deposit and reserve ID before blockchain transaction',
  })
  @ApiBody({ type: CreateDepositDto })
  @ApiResponse({
    status: 201,
    description: 'Deposit created successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          user_id: 1,
          pool_id: 1,
          amount_usd: '1000000000',
          status: 'PENDING',
          created_at: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({
    summary: 'Confirm deposit',
    description: 'Finalize deposit after blockchain transaction confirmation',
  })
  @ApiParam({ name: 'id', description: 'Deposit ID', type: Number })
  @ApiBody({ type: ConfirmDepositDto })
  @ApiResponse({
    status: 200,
    description: 'Deposit confirmed successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          status: 'CONFIRMED',
          tx_hash: '0xabc123...',
          confirmed_at: '2025-01-15T10:05:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid transaction',
  })
  @ApiResponse({ status: 404, description: 'Deposit not found' })
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
  @ApiOperation({
    summary: 'Apply boost to deposit',
    description: 'Apply APY boost to an existing deposit',
  })
  @ApiParam({ name: 'id', description: 'Deposit ID', type: Number })
  @ApiBody({ type: ApplyBoostToDepositDto })
  @ApiResponse({
    status: 200,
    description: 'Boost applied successfully',
    schema: {
      example: {
        success: true,
        data: {
          deposit_id: 1,
          boost_applied: true,
          new_apy_bp: 2300,
          boost_amount_bp: 500,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Boost requirements not met',
  })
  @ApiResponse({ status: 404, description: 'Deposit not found' })
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
  @ApiOperation({
    summary: 'Get all deposits',
    description: 'Retrieve all deposits, optionally filtered by user address',
  })
  @ApiQuery({
    name: 'userAddress',
    required: false,
    description: 'User wallet address to filter deposits',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Deposits retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            user_id: 1,
            pool_id: 1,
            amount_usd: '1000000000',
            status: 'CONFIRMED',
            created_at: '2025-01-15T10:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({
    summary: 'Get deposit by ID',
    description: 'Retrieve detailed information about a specific deposit',
  })
  @ApiParam({ name: 'id', description: 'Deposit ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Deposit found',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          user_id: 1,
          pool_id: 1,
          amount_usd: '1000000000',
          status: 'CONFIRMED',
          tx_hash: '0xabc123...',
          created_at: '2025-01-15T10:00:00.000Z',
          confirmed_at: '2025-01-15T10:05:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Deposit not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
