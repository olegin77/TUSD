import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TronIndexerService } from './services/tron-indexer.service';
import { TronBridgeService } from './services/tron-bridge.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/v1/tron')
export class TronController {
  constructor(
    private readonly indexerService: TronIndexerService,
    private readonly bridgeService: TronBridgeService,
  ) {}

  /**
   * GET /api/v1/tron/status
   * Get Tron indexer status
   */
  @Get('status')
  async getIndexerStatus() {
    return {
      success: true,
      data: this.indexerService.getStatus(),
    };
  }

  /**
   * POST /api/v1/tron/indexer/start
   * Start Tron indexer (admin only)
   */
  @Post('indexer/start')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async startIndexer() {
    try {
      await this.indexerService.start();
      return {
        success: true,
        message: 'Tron indexer started',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to start indexer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/tron/indexer/stop
   * Stop Tron indexer (admin only)
   */
  @Post('indexer/stop')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async stopIndexer() {
    try {
      await this.indexerService.stop();
      return {
        success: true,
        message: 'Tron indexer stopped',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to stop indexer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/tron/process-tx/:txHash
   * Manually process a specific transaction
   */
  @Post('process-tx/:txHash')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async processTransaction(@Param('txHash') txHash: string) {
    try {
      const result = await this.indexerService.processTransaction(txHash);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to process transaction: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/v1/tron/bridge/status/:depositId
   * Get bridge status for a deposit
   */
  @Get('bridge/status/:depositId')
  async getBridgeStatus(@Param('depositId') depositId: string) {
    try {
      const status = await this.bridgeService.getBridgeStatus(depositId);
      return {
        success: true,
        data: status,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get bridge status: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * GET /api/v1/tron/bridge/stats
   * Get bridge statistics
   */
  @Get('bridge/stats')
  async getBridgeStats() {
    try {
      const stats = await this.bridgeService.getBridgeStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get bridge stats: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
