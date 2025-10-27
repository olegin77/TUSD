import { Module } from '@nestjs/common';
import { OraclesService } from './oracles.service';
import { OraclesController } from './oracles.controller';
import { PriceOracleService } from './services/price-oracle.service';

@Module({
  controllers: [OraclesController],
  providers: [OraclesService, PriceOracleService],
  exports: [OraclesService, PriceOracleService],
})
export class OraclesModule {}
