export interface AppConfig {
  // Application
  nodeEnv: string;
  port: number;
  corsOrigin: string;

  // Database
  databaseUrl: string;
  redisUrl: string;

  // JWT & Security
  jwtSecret: string;
  jwtExpiresIn: string;
  adminJwtSecret: string;

  // Solana
  solana: {
    rpcUrl: string;
    websocketUrl: string;
    poolProgramId: string;
    wexelNftProgramId: string;
    rewardsProgramId: string;
    collateralProgramId: string;
    oracleProgramId: string;
    marketplaceProgramId: string;
    boostMintAddress: string;
  };

  // Tron
  tron: {
    gridApiKey: string;
    network: string;
    depositVaultAddress: string;
    priceFeedAddress: string;
    bridgeProxyAddress: string;
    usdtAddress: string;
  };

  // Oracles
  oracles: {
    pythPriceFeedId: string;
    chainlinkPriceFeedAddress: string;
    cexApiKey: string;
  };

  // WalletConnect
  walletConnectProjectId: string;

  // Admin & Security
  admin: {
    multisigAddress: string;
    pauseGuardianAddress: string;
    timelockAddress: string;
  };

  // KYC/AML
  kyc: {
    providerApiKey: string;
  };

  // Notifications
  notifications: {
    emailApiKey: string;
    smsApiKey: string;
    telegramBotToken: string;
    telegramChatId: string;
  };

  // Sentry
  sentry: {
    dsn: string;
    environment: string;
    tracesSampleRate: number;
  };
}

export default (): Partial<AppConfig> => ({
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Database
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,

  // JWT & Security
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET,

  // Solana
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    websocketUrl:
      process.env.SOLANA_WEBSOCKET_URL || 'wss://api.devnet.solana.com',
    poolProgramId: process.env.SOLANA_POOL_PROGRAM_ID || '',
    wexelNftProgramId: process.env.SOLANA_WEXEL_NFT_PROGRAM_ID || '',
    rewardsProgramId: process.env.SOLANA_REWARDS_PROGRAM_ID || '',
    collateralProgramId: process.env.SOLANA_COLLATERAL_PROGRAM_ID || '',
    oracleProgramId: process.env.SOLANA_ORACLE_PROGRAM_ID || '',
    marketplaceProgramId: process.env.SOLANA_MARKETPLACE_PROGRAM_ID || '',
    boostMintAddress: process.env.SOLANA_BOOST_MINT_ADDRESS || '',
  },

  // Tron
  tron: {
    gridApiKey: process.env.TRON_GRID_API_KEY || '',
    network: process.env.TRON_NETWORK || 'nile',
    depositVaultAddress: process.env.TRON_DEPOSIT_VAULT_ADDRESS || '',
    priceFeedAddress: process.env.TRON_PRICE_FEED_ADDRESS || '',
    bridgeProxyAddress: process.env.TRON_BRIDGE_PROXY_ADDRESS || '',
    usdtAddress:
      process.env.TRON_USDT_ADDRESS || 'TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8',
  },

  // Oracles
  oracles: {
    pythPriceFeedId: process.env.PYTH_PRICE_FEED_ID || '',
    chainlinkPriceFeedAddress: process.env.CHAINLINK_PRICE_FEED_ADDRESS || '',
    cexApiKey: process.env.CEX_API_KEY || '',
  },

  // WalletConnect
  walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || '',

  // Admin & Security
  admin: {
    multisigAddress: process.env.ADMIN_MULTISIG_ADDRESS || '',
    pauseGuardianAddress: process.env.PAUSE_GUARDIAN_ADDRESS || '',
    timelockAddress: process.env.TIMELOCK_ADDRESS || '',
  },

  // KYC/AML
  kyc: {
    providerApiKey: process.env.KYC_PROVIDER_API_KEY || '',
  },

  // Notifications
  notifications: {
    emailApiKey: process.env.EMAIL_API_KEY || '',
    smsApiKey: process.env.SMS_API_KEY || '',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  },

  // Sentry
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1',
    ),
  },
});
