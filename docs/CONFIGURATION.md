# Configuration Management

## Overview

The USDX/Wexel platform uses **environment-based configuration** with validation to ensure all required settings are provided and correct.

## Configuration Structure

### Files

- **`.env.example`** - Template with all available configuration options
- **`apps/indexer/src/common/config/configuration.ts`** - Configuration loader with defaults
- **`apps/indexer/src/common/config/validation.schema.ts`** - Joi validation schema
- **`apps/indexer/src/common/config/config.service.ts`** - Type-safe configuration service

### Architecture

```
Environment Variables (.env)
           ↓
Configuration Loader (configuration.ts)
           ↓
Validation Schema (validation.schema.ts)
           ↓
Type-safe Service (config.service.ts)
           ↓
Application Code
```

## Setup

### 1. Create Environment File

```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

### 2. Required Variables

**Minimum for Development:**

```env
# JWT (required)
JWT_SECRET=your_strong_secret_at_least_32_characters_long

# Database (optional for dev, uses defaults)
DATABASE_URL=postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel
REDIS_URL=redis://localhost:6379
```

**Required for Production:**

```env
NODE_ENV=production
JWT_SECRET=<secure-random-string>
DATABASE_URL=<production-database-url>
REDIS_URL=<production-redis-url>
SENTRY_DSN=<sentry-project-dsn>
```

### 3. Configuration Categories

#### Application

```env
NODE_ENV=development|production|test|staging
API_PORT=3001
CORS_ORIGIN=http://localhost:3000
```

#### Database

```env
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
```

#### JWT & Security

```env
JWT_SECRET=your_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=admin_secret_or_same_as_jwt
```

#### Solana

```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com
SOLANA_POOL_PROGRAM_ID=<program-id>
SOLANA_WEXEL_NFT_PROGRAM_ID=<program-id>
SOLANA_REWARDS_PROGRAM_ID=<program-id>
SOLANA_COLLATERAL_PROGRAM_ID=<program-id>
SOLANA_ORACLE_PROGRAM_ID=<program-id>
SOLANA_MARKETPLACE_PROGRAM_ID=<program-id>
SOLANA_BOOST_MINT_ADDRESS=<token-mint>
```

#### Tron

```env
TRON_GRID_API_KEY=<api-key>
TRON_NETWORK=nile|shasta|mainnet
TRON_DEPOSIT_VAULT_ADDRESS=<contract-address>
TRON_PRICE_FEED_ADDRESS=<contract-address>
TRON_BRIDGE_PROXY_ADDRESS=<contract-address>
TRON_USDT_ADDRESS=TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8
```

#### Oracles

```env
PYTH_PRICE_FEED_ID=<feed-id>
CHAINLINK_PRICE_FEED_ADDRESS=<contract-address>
CEX_API_KEY=<api-key>
```

#### WalletConnect

```env
WALLETCONNECT_PROJECT_ID=<project-id>
```

#### Admin & Security

```env
ADMIN_MULTISIG_ADDRESS=<multisig-address>
PAUSE_GUARDIAN_ADDRESS=<guardian-address>
TIMELOCK_ADDRESS=<timelock-address>
```

#### KYC/AML

```env
KYC_PROVIDER_API_KEY=<api-key>
```

#### Notifications

```env
EMAIL_API_KEY=<sendgrid-or-similar>
SMS_API_KEY=<twilio-or-similar>
TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_CHAT_ID=<chat-id>
```

#### Monitoring

```env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_TRACES_SAMPLE_RATE=0.1
```

## Usage in Code

### Using TypedConfigService

**Recommended** - Type-safe, with IDE autocomplete:

```typescript
import { TypedConfigService } from "./common/config/config.service";

@Injectable()
export class MyService {
  constructor(private config: TypedConfigService) {}

  async connect() {
    const rpcUrl = this.config.solanaRpcUrl;
    const isDev = this.config.isDevelopment;
    // ...
  }
}
```

### Using NestJS ConfigService

Direct access (less type-safe):

```typescript
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MyService {
  constructor(private config: ConfigService) {}

  async connect() {
    const rpcUrl = this.config.get<string>("solana.rpcUrl");
    // ...
  }
}
```

### In Modules

```typescript
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    SomeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get("API_KEY"),
      }),
    }),
  ],
})
export class AppModule {}
```

## Validation

### How It Works

On application startup, **all environment variables** are validated against the schema in `validation.schema.ts`:

1. Check required variables are present
2. Validate data types (string, number, etc.)
3. Check allowed values (enums)
4. Apply defaults
5. Throw error if validation fails

### Validation Rules

#### Required in Production

- `JWT_SECRET` (minimum 32 characters)
- `DATABASE_URL`
- `REDIS_URL`

#### Enums

- `NODE_ENV`: development, production, test, staging
- `TRON_NETWORK`: mainnet, shasta, nile

#### Formats

- URLs must be valid URIs
- Numbers must be valid integers/floats
- Sentry sample rate: 0.0 - 1.0

### Adding New Configuration

1. **Add to `.env.example`**

```env
# My New Feature
MY_NEW_CONFIG=default_value
```

2. **Add to `configuration.ts`**

```typescript
export interface AppConfig {
  // ... existing
  myNewConfig: string;
}

export default (): Partial<AppConfig> => ({
  // ... existing
  myNewConfig: process.env.MY_NEW_CONFIG || "default",
});
```

3. **Add to `validation.schema.ts`**

```typescript
export const validationSchema = Joi.object({
  // ... existing
  MY_NEW_CONFIG: Joi.string().default("default"),
});
```

4. **Add to `config.service.ts`** (optional)

```typescript
export class TypedConfigService {
  // ... existing

  get myNewConfig(): string {
    return this.configService.get<string>("myNewConfig", { infer: true })!;
  }
}
```

5. **Update documentation**

Update this file with the new configuration option.

## Environment-Specific Files

### Development

```bash
.env.development
```

### Staging

```bash
.env.staging
```

### Production

Use environment variables from hosting platform (e.g., DigitalOcean App Platform secrets).

### Testing

```bash
.env.test
```

## Best Practices

### ✅ DO

- Use `.env` for local development
- Keep `.env.example` updated
- Use descriptive variable names
- Set secure defaults when possible
- Validate all configuration on startup
- Use TypedConfigService for type safety
- Document all new configuration options

### ❌ DON'T

- Commit `.env` files to git
- Store secrets in code
- Use production credentials locally
- Skip validation for "optional" settings
- Hardcode configuration values
- Use `process.env` directly in code

## Security

### Secrets Management

**Local Development:**

- Use `.env` file (gitignored)
- Never commit secrets

**CI/CD:**

- Use GitHub Secrets
- Inject via environment variables

**Production:**

- Use platform secrets manager (DigitalOcean, AWS Secrets Manager, etc.)
- Rotate secrets regularly
- Use different secrets per environment

### JWT Secret

Generate secure random string:

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Database URLs

Include authentication:

```
postgresql://username:password@host:port/database?sslmode=require
```

Always use SSL in production (`sslmode=require`).

## Troubleshooting

### Application Won't Start

**Error:** "JWT_SECRET is required"

**Solution:** Add `JWT_SECRET` to `.env` file with at least 32 characters.

---

**Error:** "Configuration validation failed"

**Solution:** Check terminal output for specific validation errors. Fix each issue in `.env`.

---

**Error:** "Cannot connect to database"

**Solution:** Verify `DATABASE_URL` is correct and database is running:

```bash
docker-compose up -d db
```

### Configuration Not Loading

1. Check `.env` file exists in correct location
2. Restart application
3. Clear any cached environment
4. Check for typos in variable names

### Type Errors

If using `TypedConfigService` and getting type errors:

```bash
# Regenerate types
cd apps/indexer
pnpm build
```

## Examples

### Complete Development .env

```env
# Application
NODE_ENV=development
API_PORT=3001
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev_jwt_secret_at_least_32_characters_long_12345678

# Solana (devnet)
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com

# Tron (testnet)
TRON_NETWORK=nile

# Development-only
SENTRY_DSN=
```

### Production-Ready .env

```env
# Application
NODE_ENV=production
API_PORT=3001
CORS_ORIGIN=https://app.usdx-wexel.com

# Database
DATABASE_URL=postgresql://prod_user:SECURE_PASSWORD@db.example.com:5432/usdx_wexel?sslmode=require
REDIS_URL=redis://redis.example.com:6379

# JWT
JWT_SECRET=SECURELY_GENERATED_RANDOM_STRING_AT_LEAST_32_CHARS
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=DIFFERENT_SECURE_ADMIN_SECRET

# Solana (mainnet)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WEBSOCKET_URL=wss://api.mainnet-beta.solana.com
SOLANA_POOL_PROGRAM_ID=<deployed-program-id>
# ... other Solana program IDs

# Tron (mainnet)
TRON_NETWORK=mainnet
TRON_GRID_API_KEY=<production-api-key>
# ... other Tron addresses

# Monitoring
SENTRY_DSN=https://<key>@sentry.io/<project>
SENTRY_TRACES_SAMPLE_RATE=0.1

# Notifications
EMAIL_API_KEY=<sendgrid-api-key>
TELEGRAM_BOT_TOKEN=<bot-token>
```

## Resources

- [NestJS Configuration Docs](https://docs.nestjs.com/techniques/configuration)
- [Joi Validation](https://joi.dev/api/)
- [12-Factor App: Config](https://12factor.net/config)
