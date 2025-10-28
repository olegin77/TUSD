import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PoolsModule } from './modules/pools/pools.module';
import { WexelsModule } from './modules/wexels/wexels.module';
import { UsersModule } from './modules/users/users.module';
import { OraclesModule } from './modules/oracles/oracles.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { CollateralModule } from './modules/collateral/collateral.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { IndexerModule } from './modules/indexer/indexer.module';
import { SentryModule } from './common/sentry/sentry.module';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SentryInterceptor } from './common/sentry/sentry.interceptor';
import { throttleConfig } from './common/config/throttle.config';
import configuration from './common/config/configuration';
import { validationSchema } from './common/config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        abortEarly: false, // Show all validation errors
        allowUnknown: true, // Allow unknown keys (for flexibility)
      },
    }),
    ThrottlerModule.forRoot(throttleConfig),
    SentryModule,
    AuthModule,
    PoolsModule,
    WexelsModule,
    UsersModule,
    OraclesModule,
    DepositsModule,
    CollateralModule,
    MarketplaceModule,
    IndexerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
