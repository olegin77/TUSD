import { Module } from '@nestjs/common';
import { CollateralService } from './collateral.service';
import { CollateralController } from './collateral.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [CollateralController],
  providers: [CollateralService, PrismaService],
  exports: [CollateralService],
})
export class CollateralModule {}
