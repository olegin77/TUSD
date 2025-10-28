import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { IndexerController } from './indexer.controller';
import { SolanaIndexerService } from './services/solana-indexer.service';
import { EventProcessorService } from './services/event-processor.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [IndexerController],
  providers: [
    IndexerService,
    SolanaIndexerService,
    EventProcessorService,
    PrismaService,
  ],
  exports: [IndexerService, SolanaIndexerService],
})
export class IndexerModule implements OnModuleInit {
  private readonly logger = new Logger(IndexerModule.name);

  constructor(private readonly indexerService: IndexerService) {}

  async onModuleInit() {
    // Auto-start indexer if enabled in config (default: true for production)
    const autoStart = process.env.AUTO_START_INDEXER !== 'false';

    if (autoStart) {
      this.logger.log('Auto-starting Solana indexer...');
      try {
        await this.indexerService.startIndexing();
        this.logger.log('Solana indexer started successfully');
      } catch (error) {
        this.logger.error('Failed to auto-start indexer', error);
      }
    } else {
      this.logger.log('Auto-start disabled, indexer will need to be started manually');
    }
  }
}
