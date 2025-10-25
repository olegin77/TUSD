import { Module } from '@nestjs/common';
import { OraclesService } from './oracles.service';
import { OraclesController } from './oracles.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [OraclesService, PrismaService],
  controllers: [OraclesController],
  exports: [OraclesService],
})
export class OraclesModule {}
