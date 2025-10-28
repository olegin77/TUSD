import { Controller, Get, Post, Param, HttpException, HttpStatus } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { SolanaIndexerService } from './services/solana-indexer.service';

@Controller('api/v1/indexer')
export class IndexerController {
  constructor(
    private readonly indexerService: IndexerService,
    private readonly solanaIndexer: SolanaIndexerService,
  ) {}

  /**
   * GET /api/v1/indexer/status
   * Get indexer status
   */
  @Get('status')
  getStatus() {
    return {
      success: true,
      data: this.indexerService.getStatus(),
    };
  }

  /**
   * POST /api/v1/indexer/start
   * Start indexing
   */
  @Post('start')
  async start() {
    try {
      await this.indexerService.startIndexing();
      return {
        success: true,
        message: 'Indexer started',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to start indexer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/indexer/stop
   * Stop indexing
   */
  @Post('stop')
  async stop() {
    try {
      await this.indexerService.stopIndexing();
      return {
        success: true,
        message: 'Indexer stopped',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to stop indexer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/indexer/transactions/:signature
   * Manually index a transaction
   */
  @Post('transactions/:signature')
  async indexTransaction(@Param('signature') signature: string) {
    try {
      const result = await this.solanaIndexer.indexTransaction(signature);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to index transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
