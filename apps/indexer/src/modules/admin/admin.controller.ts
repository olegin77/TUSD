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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

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
   */
  @Post('oracles/:token/refresh')
  async refreshOracle(@Param('token') token: string) {
    // TODO: Implement oracle refresh
    return { success: true, message: `Oracle for ${token} refreshed` };
  }

  /**
   * POST /api/v1/admin/oracles/:token/manual-price
   * Set manual price for a token (requires Multisig)
   */
  @Post('oracles/:token/manual-price')
  async setManualPrice(
    @Param('token') token: string,
    @Body() body: { price: number },
  ) {
    // TODO: Implement manual price setting with Multisig
    return {
      success: true,
      message: `Manual price ${body.price} set for ${token}. Awaiting Multisig confirmation.`,
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
   */
  @Patch('settings')
  async updateSettings(@Body() settings: any) {
    return this.adminService.updateGlobalSettings(settings);
  }

  /**
   * PATCH /api/v1/admin/pools/:id
   * Update pool configuration
   */
  @Patch('pools/:id')
  async updatePool(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePool(parseInt(id), data);
  }
}
