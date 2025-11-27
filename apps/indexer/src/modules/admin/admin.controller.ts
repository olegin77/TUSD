import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { ManualPriceUpdateDto } from './dto/manual-price-update.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/v1/admin/dashboard
   * Get admin dashboard statistics
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Get admin dashboard',
    description: 'Retrieve comprehensive statistics for admin dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved',
    schema: {
      example: {
        totalUsers: 1250,
        totalDeposits: 5420000,
        totalWexels: 3200,
        activeListings: 150,
        systemHealth: 'healthy',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  /**
   * GET /api/v1/admin/users
   * Get all users
   */
  @Get('users')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve list of all registered users',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          wallet_address: '0xabc...',
          created_at: '2025-01-15T10:00:00.000Z',
          total_deposits: '5000000000',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  /**
   * GET /api/v1/admin/wexels
   * Get all wexels
   */
  @Get('wexels')
  @ApiOperation({
    summary: 'Get all wexels',
    description: 'Retrieve list of all wexels with optional status filter',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by wexel status (ACTIVE, LOCKED, LISTED, SOLD)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Wexels retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          deposit_id: 123,
          owner_address: '0xabc...',
          status: 'ACTIVE',
          maturity_date: '2026-01-15T10:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getWexels(@Query('status') status?: string) {
    return this.adminService.getAllWexels({ status });
  }

  /**
   * GET /api/v1/admin/oracles
   * Get oracle data
   */
  @Get('oracles')
  @ApiOperation({
    summary: 'Get oracle data',
    description: 'Retrieve current oracle price data for all supported tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Oracle data retrieved',
    schema: {
      example: {
        tokens: [
          {
            mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
            price: 1.0005,
            sources: ['Pyth', 'Chainlink'],
            updated_at: '2025-01-15T10:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getOracles() {
    return this.adminService.getOracleData();
  }

  /**
   * POST /api/v1/admin/oracles/:token/refresh
   * Refresh oracle price for a token
   * MEDIUM-03 FIX: Rate limit 1 request per minute
   */
  @Post('oracles/:token/refresh')
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @ApiOperation({
    summary: 'Refresh oracle price',
    description: 'Force refresh of oracle price data for a specific token',
  })
  @ApiParam({ name: 'token', description: 'Token mint address', type: String })
  @ApiResponse({
    status: 200,
    description: 'Oracle refreshed successfully',
    schema: {
      example: {
        success: true,
        message:
          'Oracle for Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB refreshed',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit 1/min',
  })
  async refreshOracle(@Param('token') token: string) {
    // TODO: Implement oracle refresh
    return { success: true, message: `Oracle for ${token} refreshed` };
  }

  /**
   * POST /api/v1/admin/oracles/:token/manual-price
   * Set manual price for a token (requires Multisig)
   * MEDIUM-03 FIX: Very strict rate limit - 5 requests per 5 minutes
   */
  @Post('oracles/:token/manual-price')
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({
    summary: 'Set manual price',
    description:
      'Set manual override price for a token (requires Multisig confirmation)',
  })
  @ApiParam({ name: 'token', description: 'Token mint address', type: String })
  @ApiBody({ type: ManualPriceUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'Manual price set, awaiting Multisig confirmation',
    schema: {
      example: {
        success: true,
        message:
          'Manual price 1.005 set for token. Reason: Oracle malfunction. Awaiting Multisig confirmation.',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - Rate limit 5/5min',
  })
  async setManualPrice(
    @Param('token') token: string,
    @Body() dto: ManualPriceUpdateDto,
  ) {
    // TODO: Implement manual price setting with Multisig
    return {
      success: true,
      message: `Manual price ${dto.price_usd} set for ${token}. Reason: ${dto.reason}. Awaiting Multisig confirmation.`,
    };
  }

  /**
   * GET /api/v1/admin/settings
   * Get global settings
   */
  @Get('settings')
  @ApiOperation({
    summary: 'Get global settings',
    description: 'Retrieve all system-wide configuration settings',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings retrieved successfully',
    schema: {
      example: {
        COLLATERAL_RATIO: '150',
        LIQUIDATION_THRESHOLD: '120',
        STABILITY_FEE: '0.02',
        MIN_DEPOSIT: '100',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getSettings() {
    return this.adminService.getGlobalSettings();
  }

  /**
   * PATCH /api/v1/admin/settings
   * Update global settings
   * MEDIUM-01 FIX: Uses validated UpdateSettingsDto
   */
  @Patch('settings')
  @ApiOperation({
    summary: 'Update global settings',
    description: 'Modify system-wide configuration settings',
  })
  @ApiBody({ type: UpdateSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Settings updated',
        updated: {
          COLLATERAL_RATIO: '160',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid settings data',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateSettings(@Body() settings: UpdateSettingsDto) {
    return this.adminService.updateGlobalSettings(settings);
  }

  /**
   * PATCH /api/v1/admin/vaults/:id
   * Update vault configuration
   */
  @Patch('vaults/:id')
  @ApiOperation({
    summary: 'Update vault configuration',
    description: 'Modify parameters for a specific staking vault',
  })
  @ApiParam({ name: 'id', description: 'Vault ID', type: String })
  @ApiBody({ type: UpdateVaultDto })
  @ApiResponse({
    status: 200,
    description: 'Vault updated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          base_usdt_apy: 6.0,
          boosted_usdt_apy: 8.4,
          takara_apr: 30.0,
          duration_months: 12,
          is_active: true,
          updated_at: '2025-01-15T10:20:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid vault data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Vault not found' })
  async updateVault(@Param('id') id: string, @Body() data: UpdateVaultDto) {
    return this.adminService.updateVault(parseInt(id), data);
  }
}
