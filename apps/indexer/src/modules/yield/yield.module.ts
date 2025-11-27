import { Module } from '@nestjs/common';
import { YieldCalculatorService } from './yield-calculator.service';
import { YieldController } from './yield.controller';

@Module({
  controllers: [YieldController],
  providers: [YieldCalculatorService],
  exports: [YieldCalculatorService],
})
export class YieldModule {}
