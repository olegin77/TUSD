import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  API_PORT: Joi.number().default(3001),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Database (required in production)
  DATABASE_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  REDIS_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // JWT (required)
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'JWT_SECRET must be at least 32 characters long',
    'any.required': 'JWT_SECRET is required',
  }),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  ADMIN_JWT_SECRET: Joi.string().optional(),

  // Solana
  SOLANA_RPC_URL: Joi.string().uri().default('https://api.devnet.solana.com'),
  SOLANA_WEBSOCKET_URL: Joi.string()
    .uri()
    .default('wss://api.devnet.solana.com'),
  SOLANA_POOL_PROGRAM_ID: Joi.string().optional(),
  SOLANA_WEXEL_NFT_PROGRAM_ID: Joi.string().optional(),
  SOLANA_REWARDS_PROGRAM_ID: Joi.string().optional(),
  SOLANA_COLLATERAL_PROGRAM_ID: Joi.string().optional(),
  SOLANA_ORACLE_PROGRAM_ID: Joi.string().optional(),
  SOLANA_MARKETPLACE_PROGRAM_ID: Joi.string().optional(),
  SOLANA_BOOST_MINT_ADDRESS: Joi.string().optional(),

  // Tron
  TRON_GRID_API_KEY: Joi.string().optional(),
  TRON_NETWORK: Joi.string().valid('mainnet', 'shasta', 'nile').default('nile'),
  TRON_DEPOSIT_VAULT_ADDRESS: Joi.string().optional(),
  TRON_PRICE_FEED_ADDRESS: Joi.string().optional(),
  TRON_BRIDGE_PROXY_ADDRESS: Joi.string().optional(),
  TRON_USDT_ADDRESS: Joi.string().default('TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8'),

  // Oracles
  PYTH_PRICE_FEED_ID: Joi.string().optional(),
  CHAINLINK_PRICE_FEED_ADDRESS: Joi.string().optional(),
  CEX_API_KEY: Joi.string().optional(),

  // WalletConnect
  WALLETCONNECT_PROJECT_ID: Joi.string().optional(),

  // Admin & Security
  ADMIN_MULTISIG_ADDRESS: Joi.string().optional(),
  PAUSE_GUARDIAN_ADDRESS: Joi.string().optional(),
  TIMELOCK_ADDRESS: Joi.string().optional(),

  // KYC/AML
  KYC_PROVIDER_API_KEY: Joi.string().optional(),

  // Notifications
  EMAIL_API_KEY: Joi.string().optional(),
  SMS_API_KEY: Joi.string().optional(),
  TELEGRAM_BOT_TOKEN: Joi.string().optional(),
  TELEGRAM_CHAT_ID: Joi.string().optional(),

  // Sentry
  SENTRY_DSN: Joi.string().uri().optional(),
  SENTRY_TRACES_SAMPLE_RATE: Joi.number().min(0).max(1).default(0.1),
});
