import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { AppConfig } from './configuration';

/**
 * Typed wrapper around NestJS ConfigService
 * Provides type-safe access to configuration values
 */
@Injectable()
export class TypedConfigService {
  constructor(private configService: NestConfigService<AppConfig>) {}

  // Application
  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv', { infer: true })!;
  }

  get port(): number {
    return this.configService.get<number>('port', { infer: true })!;
  }

  get corsOrigin(): string {
    return this.configService.get<string>('corsOrigin', { infer: true })!;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Database
  get databaseUrl(): string {
    return this.configService.get<string>('databaseUrl', { infer: true })!;
  }

  get redisUrl(): string {
    return this.configService.get<string>('redisUrl', { infer: true })!;
  }

  // JWT
  get jwtSecret(): string {
    return this.configService.get<string>('jwtSecret', { infer: true })!;
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('jwtExpiresIn', { infer: true })!;
  }

  get adminJwtSecret(): string {
    return (
      this.configService.get<string>('adminJwtSecret', { infer: true }) ||
      this.jwtSecret
    );
  }

  // Solana
  get solanaRpcUrl(): string {
    return this.configService.get<string>('solana.rpcUrl', { infer: true })!;
  }

  get solanaWebsocketUrl(): string {
    return this.configService.get<string>('solana.websocketUrl', {
      infer: true,
    })!;
  }

  get solanaPoolProgramId(): string {
    return this.configService.get<string>('solana.poolProgramId', {
      infer: true,
    })!;
  }

  get solanaWexelNftProgramId(): string {
    return this.configService.get<string>('solana.wexelNftProgramId', {
      infer: true,
    })!;
  }

  get solanaRewardsProgramId(): string {
    return this.configService.get<string>('solana.rewardsProgramId', {
      infer: true,
    })!;
  }

  get solanaCollateralProgramId(): string {
    return this.configService.get<string>('solana.collateralProgramId', {
      infer: true,
    })!;
  }

  get solanaOracleProgramId(): string {
    return this.configService.get<string>('solana.oracleProgramId', {
      infer: true,
    })!;
  }

  get solanaMarketplaceProgramId(): string {
    return this.configService.get<string>('solana.marketplaceProgramId', {
      infer: true,
    })!;
  }

  get solanaBoostMintAddress(): string {
    return this.configService.get<string>('solana.boostMintAddress', {
      infer: true,
    })!;
  }

  // Tron
  get tronGridApiKey(): string {
    return this.configService.get<string>('tron.gridApiKey', { infer: true })!;
  }

  get tronNetwork(): string {
    return this.configService.get<string>('tron.network', { infer: true })!;
  }

  get tronDepositVaultAddress(): string {
    return this.configService.get<string>('tron.depositVaultAddress', {
      infer: true,
    })!;
  }

  get tronPriceFeedAddress(): string {
    return this.configService.get<string>('tron.priceFeedAddress', {
      infer: true,
    })!;
  }

  get tronBridgeProxyAddress(): string {
    return this.configService.get<string>('tron.bridgeProxyAddress', {
      infer: true,
    })!;
  }

  get tronUsdtAddress(): string {
    return this.configService.get<string>('tron.usdtAddress', {
      infer: true,
    })!;
  }

  // Oracles
  get pythPriceFeedId(): string {
    return this.configService.get<string>('oracles.pythPriceFeedId', {
      infer: true,
    })!;
  }

  get chainlinkPriceFeedAddress(): string {
    return this.configService.get<string>('oracles.chainlinkPriceFeedAddress', {
      infer: true,
    })!;
  }

  get cexApiKey(): string {
    return this.configService.get<string>('oracles.cexApiKey', {
      infer: true,
    })!;
  }

  // WalletConnect
  get walletConnectProjectId(): string {
    return this.configService.get<string>('walletConnectProjectId', {
      infer: true,
    })!;
  }

  // Admin
  get adminMultisigAddress(): string {
    return this.configService.get<string>('admin.multisigAddress', {
      infer: true,
    })!;
  }

  get adminPauseGuardianAddress(): string {
    return this.configService.get<string>('admin.pauseGuardianAddress', {
      infer: true,
    })!;
  }

  get adminTimelockAddress(): string {
    return this.configService.get<string>('admin.timelockAddress', {
      infer: true,
    })!;
  }

  // KYC
  get kycProviderApiKey(): string {
    return this.configService.get<string>('kyc.providerApiKey', {
      infer: true,
    })!;
  }

  // Notifications
  get emailApiKey(): string {
    return this.configService.get<string>('notifications.emailApiKey', {
      infer: true,
    })!;
  }

  get smsApiKey(): string {
    return this.configService.get<string>('notifications.smsApiKey', {
      infer: true,
    })!;
  }

  get telegramBotToken(): string {
    return this.configService.get<string>('notifications.telegramBotToken', {
      infer: true,
    })!;
  }

  get telegramChatId(): string {
    return this.configService.get<string>('notifications.telegramChatId', {
      infer: true,
    })!;
  }

  // Sentry
  get sentryDsn(): string {
    return this.configService.get<string>('sentry.dsn', { infer: true })!;
  }

  get sentryEnvironment(): string {
    return this.configService.get<string>('sentry.environment', {
      infer: true,
    })!;
  }

  get sentryTracesSampleRate(): number {
    return this.configService.get<number>('sentry.tracesSampleRate', {
      infer: true,
    })!;
  }

  // Generic getter for custom values
  get<T>(key: string): T | undefined {
    return this.configService.get<T>(key as any);
  }

  // Get with default
  getOrThrow<T = any>(key: string, defaultValue?: T): T {
    const value = this.configService.get<T>(key as any);
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Configuration key "${key}" is not defined`);
    }
    return value ?? defaultValue!;
  }
}
