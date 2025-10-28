import { Module } from '@nestjs/common';
import { OraclesController } from './oracles.controller';
import { OraclesService } from './oracles.service';
import { PriceOracleService } from './services/price-oracle.service';
import { PythOracleService } from './services/pyth-oracle.service';
import { DexOracleService } from './services/dex-oracle.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [OraclesController],
  providers: [
    OraclesService,
    PriceOracleService,
    PythOracleService,
    DexOracleService,
    PrismaService,
  ],
  exports: [OraclesService, PriceOracleService],
})
export class OraclesModule {}
