import { Module } from '@nestjs/common';
import { WexelsService } from './wexels.service';
import { WexelsController } from './wexels.controller';

@Module({
  controllers: [WexelsController],
  providers: [WexelsService],
  exports: [WexelsService],
})
export class WexelsModule {}
