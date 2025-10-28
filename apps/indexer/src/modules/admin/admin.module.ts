import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../../database/prisma.module';
import { PoolsModule } from '../pools/pools.module';
import { WexelsModule } from '../wexels/wexels.module';
import { UsersModule } from '../users/users.module';
import { OraclesModule } from '../oracles/oracles.module';

@Module({
  imports: [PrismaModule, PoolsModule, WexelsModule, UsersModule, OraclesModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
