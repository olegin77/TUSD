# Configuration Guide

## Environment Variables

The application uses environment variables for configuration. See `.env.example` for all available options.

### Required Variables

#### Database
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
```

#### API
```bash
API_PORT=3001
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_strong_jwt_secret
```

#### Blockchain Networks

**Solana:**
```bash
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com
SOLANA_POOL_PROGRAM_ID=...
SOLANA_WEXEL_NFT_PROGRAM_ID=...
SOLANA_REWARDS_PROGRAM_ID=...
SOLANA_COLLATERAL_PROGRAM_ID=...
SOLANA_ORACLE_PROGRAM_ID=...
SOLANA_MARKETPLACE_PROGRAM_ID=...
```

**Tron:**
```bash
TRON_GRID_API_KEY=your_api_key
TRON_NETWORK=nile  # or mainnet
TRON_DEPOSIT_VAULT_ADDRESS=...
TRON_PRICE_FEED_ADDRESS=...
TRON_BRIDGE_PROXY_ADDRESS=...
```

#### Oracles
```bash
PYTH_PRICE_FEED_ID=...
CHAINLINK_PRICE_FEED_ADDRESS=...
CEX_API_KEY=...  # For price aggregation
```

### Optional Variables

#### Security
```bash
ADMIN_MULTISIG_ADDRESS=...
PAUSE_GUARDIAN_ADDRESS=...
TIMELOCK_ADDRESS=...
```

#### Monitoring
```bash
SENTRY_DSN=https://...
```

#### Notifications
```bash
EMAIL_API_KEY=...
TELEGRAM_BOT_TOKEN=...
```

## Configuration Validation

The application validates configuration on startup using Joi schemas. Invalid configuration will prevent the application from starting.

See `apps/indexer/src/common/config/validation.schema.ts` for validation rules.

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in required values
3. Start dependencies: `docker-compose up -d`
4. Run migrations: `pnpm prisma:migrate:dev`
5. Start development server: `pnpm start:dev`

## Production Deployment

1. Set all environment variables via your hosting platform
2. Run migrations: `pnpm prisma:migrate:deploy`
3. Start server: `pnpm start:prod`

## Security Best Practices

- Never commit `.env` files
- Use strong, unique secrets for JWT and database passwords
- Rotate API keys regularly
- Use read-only database credentials for indexer where possible
- Store sensitive values in a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault)
