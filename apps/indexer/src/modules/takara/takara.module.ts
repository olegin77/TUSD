import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TakaraController } from './takara.controller';
import { LaikaPriceService } from './services/laika-price.service';
import { TakaraMiningService } from './services/takara-mining.service';
import { YieldCalculatorService } from './services/yield-calculator.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TakaraController],
  providers: [
    PrismaService,
    LaikaPriceService,
    TakaraMiningService,
    YieldCalculatorService,
  ],
  exports: [LaikaPriceService, TakaraMiningService, YieldCalculatorService],
})
export class TakaraModule {}
