import { Module } from '@nestjs/common';
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
  exports: [IndexerService],
})
export class IndexerModule {}
