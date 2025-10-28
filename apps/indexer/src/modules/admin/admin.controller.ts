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
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { ManualPriceUpdateDto } from './dto/manual-price-update.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/v1/admin/dashboard
   * Get admin dashboard statistics
   */
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  /**
   * GET /api/v1/admin/users
   * Get all users
   */
  @Get('users')
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  /**
   * GET /api/v1/admin/wexels
   * Get all wexels
   */
  @Get('wexels')
  async getWexels(@Query('status') status?: string) {
    return this.adminService.getAllWexels({ status });
  }

  /**
   * GET /api/v1/admin/oracles
   * Get oracle data
   */
  @Get('oracles')
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
  async getSettings() {
    return this.adminService.getGlobalSettings();
  }

  /**
   * PATCH /api/v1/admin/settings
   * Update global settings
   * MEDIUM-01 FIX: Uses validated UpdateSettingsDto
   */
  @Patch('settings')
  async updateSettings(@Body() settings: UpdateSettingsDto) {
    return this.adminService.updateGlobalSettings(settings);
  }

  /**
   * PATCH /api/v1/admin/pools/:id
   * Update pool configuration
   * MEDIUM-01 FIX: Uses validated UpdatePoolDto
   */
  @Patch('pools/:id')
  async updatePool(@Param('id') id: string, @Body() data: UpdatePoolDto) {
    return this.adminService.updatePool(parseInt(id), data);
  }
}
