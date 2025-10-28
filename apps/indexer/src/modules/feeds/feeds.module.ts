import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [FeedsController],
  providers: [PrismaService],
})
export class FeedsModule {}
