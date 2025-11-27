import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { DepositFlowService } from './deposit-flow.service';
import { PrismaService } from '../../database/prisma.service';
import { YieldModule } from '../yield/yield.module';

@Module({
  imports: [YieldModule],
  controllers: [DepositsController],
  providers: [DepositsService, DepositFlowService, PrismaService],
  exports: [DepositsService, DepositFlowService],
})
export class DepositsModule {}
