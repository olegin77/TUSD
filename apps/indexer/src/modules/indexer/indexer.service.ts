import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SolanaIndexerService } from './services/solana-indexer.service';

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);

  constructor(
    private readonly solanaIndexer: SolanaIndexerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Indexer Service...');
    
    // Start indexing if enabled
    const startIndexing = process.env.START_INDEXING === 'true';
    if (startIndexing) {
      this.logger.log('Auto-starting indexer...');
      await this.startIndexing();
    } else {
      this.logger.log('Indexer not auto-started. Set START_INDEXING=true to enable.');
    }
  }

  /**
   * Start indexing blockchain events
   */
  async startIndexing() {
    this.logger.log('Starting blockchain event indexing...');
    
    try {
      // Start Solana indexer
      await this.solanaIndexer.start();
      this.logger.log('Solana indexer started successfully');
    } catch (error) {
      this.logger.error('Failed to start indexer', error);
      throw error;
    }
  }

  /**
   * Stop indexing
   */
  async stopIndexing() {
    this.logger.log('Stopping blockchain event indexing...');
    await this.solanaIndexer.stop();
    this.logger.log('Indexer stopped');
  }

  /**
   * Get indexer status
   */
  getStatus() {
    return {
      solana: this.solanaIndexer.getStatus(),
    };
  }
}
