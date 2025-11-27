import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PoolsService } from './pools.service';

/**
 * Vaults (formerly Pools) Controller
 * Read-only API for vault information
 * Admin operations are handled in /api/v1/admin/vaults
 */
@ApiTags('vaults')
@Controller('api/v1/vaults')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all vaults',
    description: 'Retrieve all active staking vaults',
  })
  @ApiResponse({
    status: 200,
    description: 'Vaults retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          name: 'Starter',
          type: 'VAULT_1',
          duration_months: 12,
          min_entry_amount: 100,
          base_usdt_apy: 7.0,
          boosted_usdt_apy: 8.4,
          takara_apr: 30.0,
          boost_token_symbol: 'LAIKA',
          base_apy_bps: 700,
          boost_apy_bps: 140,
          max_apy_bps: 840,
          is_active: true,
        },
        {
          id: 2,
          name: 'Advanced',
          type: 'VAULT_2',
          duration_months: 30,
          min_entry_amount: 1500,
          base_usdt_apy: 7.0,
          boosted_usdt_apy: 13.0,
          takara_apr: 30.0,
          boost_token_symbol: 'TAKARA',
          base_apy_bps: 700,
          boost_apy_bps: 600,
          max_apy_bps: 1300,
          is_active: true,
        },
        {
          id: 3,
          name: 'Whale',
          type: 'VAULT_3',
          duration_months: 36,
          min_entry_amount: 5000,
          base_usdt_apy: 8.0,
          boosted_usdt_apy: 15.0,
          takara_apr: 40.0,
          boost_token_symbol: 'TAKARA',
          base_apy_bps: 800,
          boost_apy_bps: 700,
          max_apy_bps: 1500,
          is_active: true,
        },
      ],
    },
  })
  findAll(): Promise<any[]> {
    return this.poolsService.findAll();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active vaults',
    description: 'Retrieve only active staking vaults',
  })
  @ApiResponse({
    status: 200,
    description: 'Active vaults retrieved successfully',
  })
  findActive(): Promise<any[]> {
    return this.poolsService.findActive();
  }

  @Get('yields')
  @ApiOperation({
    summary: 'Get vault yield summary',
    description: 'Retrieve yield information for all vaults including USDT APY and Takara APR',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault yields retrieved successfully',
    schema: {
      example: [
        {
          vaultId: 1,
          name: 'Starter',
          type: 'VAULT_1',
          minEntryAmount: 100,
          durationMonths: 12,
          boostToken: 'LAIKA',
          boostRatio: 0.4,
          boostDiscount: 0.15,
          usdtYield: {
            baseApy: 7.0,
            boostApy: 1.4,
            maxApy: 8.4,
            baseApyBps: 700,
            boostApyBps: 140,
            maxApyBps: 840,
            maxApyMonthly: 8.4,
            maxApyQuarterly: 9.66,
            maxApyYearly: 10.92,
          },
          takaraYield: {
            apr: 30.0,
            aprBps: 3000,
            miningAllocation: 0,
          },
          batchInfo: {
            currentBatch: 1,
            status: 'COLLECTING',
            currentLiquidity: 0,
            targetLiquidity: 100000,
          },
        },
        {
          vaultId: 2,
          name: 'Advanced',
          type: 'VAULT_2',
          minEntryAmount: 1500,
          durationMonths: 30,
          boostToken: 'TAKARA',
          boostRatio: 1.0,
          boostFixedPrice: 0.10,
          usdtYield: {
            baseApy: 7.0,
            boostApy: 6.0,
            maxApy: 13.0,
            baseApyBps: 700,
            boostApyBps: 600,
            maxApyBps: 1300,
            maxApyMonthly: 13.0,
            maxApyQuarterly: 14.95,
            maxApyYearly: 16.9,
          },
          takaraYield: {
            apr: 30.0,
            aprBps: 3000,
            miningAllocation: 0,
          },
          batchInfo: {
            currentBatch: 1,
            status: 'COLLECTING',
            currentLiquidity: 0,
            targetLiquidity: 100000,
          },
        },
      ],
    },
  })
  getYieldSummary(): Promise<any[]> {
    return this.poolsService.getYieldSummary();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vault by ID',
    description: 'Retrieve detailed information about a specific vault',
  })
  @ApiParam({ name: 'id', description: 'Vault ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Vault found',
    schema: {
      example: {
        id: 1,
        name: 'Starter',
        type: 'VAULT_1',
        duration_months: 12,
        min_entry_amount: 100,
        base_usdt_apy: 7.0,
        boosted_usdt_apy: 8.4,
        takara_apr: 30.0,
        boost_token_symbol: 'LAIKA',
        boost_ratio: 0.4,
        boost_discount: 0.15,
        base_apy_bps: 700,
        boost_apy_bps: 140,
        max_apy_bps: 840,
        takara_apr_bps: 3000,
        batch_number: 1,
        batch_status: 'COLLECTING',
        current_liquidity: 0,
        target_liquidity: 100000,
        is_active: true,
        created_at: '2025-01-15T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Vault not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.poolsService.findOne(id.toString());
  }
}
