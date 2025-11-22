import { Module } from '@nestjs/common';
import { WexelsService } from './wexels.service';
import { WexelsController } from './wexels.controller';
import { BoostService } from './services/boost.service';
import { OraclesModule } from '../oracles/oracles.module';

@Module({
  imports: [OraclesModule],
  controllers: [WexelsController],
  providers: [WexelsService, BoostService],
  exports: [WexelsService, BoostService],
})
export class WexelsModule {}
