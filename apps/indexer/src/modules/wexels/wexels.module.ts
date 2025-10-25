import { Module } from '@nestjs/common';
import { WexelsService } from './wexels.service';
import { WexelsController } from './wexels.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [WexelsService, PrismaService],
  controllers: [WexelsController],
  exports: [WexelsService],
})
export class WexelsModule {}
