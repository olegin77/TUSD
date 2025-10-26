import { Module } from '@nestjs/common';
import { OraclesService } from './oracles.service';
import { OraclesController } from './oracles.controller';

@Module({
  controllers: [OraclesController],
  providers: [OraclesService],
  exports: [OraclesService],
})
export class OraclesModule {}
