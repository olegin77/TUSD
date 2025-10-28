import { Module } from '@nestjs/common';
import { TronIndexerService } from './services/tron-indexer.service';
import { TronEventProcessor } from './services/tron-event-processor.service';
import { TronBridgeService } from './services/tron-bridge.service';
import { TronController } from './tron.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TronController],
  providers: [TronIndexerService, TronEventProcessor, TronBridgeService],
  exports: [TronIndexerService, TronBridgeService],
})
export class TronModule {}
