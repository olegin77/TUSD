import { Module } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolsController } from './pools.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [PoolsService, PrismaService],
  controllers: [PoolsController],
  exports: [PoolsService],
})
export class PoolsModule {}
