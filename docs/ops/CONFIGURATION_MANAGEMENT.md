# Configuration Management Strategy

## Overview

This document describes the configuration management strategy for the USDX/Wexel platform across different environments.

## Environments

### Local Development
- **Storage**: `.env` files (git-ignored)
- **Location**: Project root and app directories
- **Security**: Developer responsibility, never commit
- **Access**: File system

### CI/CD (GitHub Actions)
- **Storage**: GitHub Secrets
- **Location**: Repository settings → Secrets and variables → Actions
- **Security**: Encrypted at rest, masked in logs
- **Access**: Workflow files via `${{ secrets.SECRET_NAME }}`

### Staging
- **Storage**: Platform environment variables (DigitalOcean App Platform / Vercel)
- **Location**: Platform dashboard → App → Settings → Environment Variables
- **Security**: Encrypted at rest, access controlled by RBAC
- **Access**: Injected at build/runtime

### Production
- **Storage**: HashiCorp Vault / AWS Secrets Manager (recommended) or Platform env vars
- **Location**: Dedicated secrets management service
- **Security**: Encrypted, audited, rotatable, with access policies
- **Access**: SDK/API with authentication

## Configuration Files

### `.env.example`
- Template file showing all available configuration options
- **Committed to git**
- Contains example/placeholder values
- Updated whenever new config options are added

### `.env` (Local)
- Actual configuration for local development
- **NEVER committed to git** (in .gitignore)
- Created by copying `.env.example` and filling real values

### `.env.test` (Optional)
- Configuration for running tests
- Can be committed if no sensitive data
- Override values for test environment

## Environment Variables by Category

### 1. Database & Cache
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://localhost:6379
```
- **Sensitivity**: High (contains credentials)
- **Rotation**: Quarterly or on compromise
- **Storage**: Vault in production

### 2. API Configuration
```bash
API_PORT=3001
CORS_ORIGIN=https://app.wexel.com
JWT_SECRET=<strong-secret-256bit>
ADMIN_JWT_SECRET=<different-strong-secret>
```
- **Sensitivity**: High (JWT secrets)
- **Rotation**: Annually or on compromise
- **Storage**: Vault in production

### 3. Blockchain Configuration
```bash
# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WEBSOCKET_URL=wss://api.mainnet-beta.solana.com
SOLANA_POOL_PROGRAM_ID=<program-address>
# ... other program IDs

# Tron
TRON_GRID_API_KEY=<api-key>
TRON_NETWORK=mainnet
TRON_DEPOSIT_VAULT_ADDRESS=<contract-address>
```
- **Sensitivity**: Medium (API keys), Low (addresses)
- **Rotation**: API keys quarterly
- **Storage**: Vault for API keys, config file for addresses

### 4. Third-Party Services
```bash
# Oracles
PYTH_PRICE_FEED_ID=<feed-id>
CHAINLINK_PRICE_FEED_ADDRESS=<address>
CEX_API_KEY=<api-key>

# Monitoring
SENTRY_DSN=https://...
SENTRY_ENVIRONMENT=production

# Notifications
EMAIL_API_KEY=<sendgrid-key>
TELEGRAM_BOT_TOKEN=<bot-token>
```
- **Sensitivity**: High (API keys)
- **Rotation**: Quarterly
- **Storage**: Vault in production

### 5. Security & Admin
```bash
ADMIN_MULTISIG_ADDRESS=<multisig-address>
PAUSE_GUARDIAN_ADDRESS=<guardian-address>
TIMELOCK_ADDRESS=<timelock-address>
```
- **Sensitivity**: Low (public addresses)
- **Rotation**: N/A (blockchain addresses)
- **Storage**: Can be in code/config

## Secret Rotation Plan

| Secret Type | Rotation Frequency | Process |
|-------------|-------------------|---------|
| Database passwords | Quarterly | Update DB, then app |
| JWT secrets | Annually | Dual-token transition |
| API keys (external) | Quarterly | Generate new, update, revoke old |
| Admin keys | On compromise only | Multi-sig ceremony |

## Access Control

### Development Team
- **Access**: Local `.env` (own copy)
- **Scope**: Development values only
- **Method**: Copy from `.env.example`, request real dev API keys from lead

### DevOps Team
- **Access**: CI/CD secrets, staging env vars
- **Scope**: Staging and production secrets
- **Method**: Platform dashboard / Vault with 2FA

### Security Team
- **Access**: Read-only access to Vault audit logs
- **Scope**: All environments
- **Method**: Vault policies

## Secrets Management Tools

### Option 1: HashiCorp Vault (Recommended for Production)
```bash
# Installation
brew install vault  # or download binary

# Start dev server (local testing)
vault server -dev

# Store secret
vault kv put secret/usdx-wexel/prod/db-password value="supersecret"

# Read secret
vault kv get secret/usdx-wexel/prod/db-password

# In application (using vault client SDK)
import Vault from 'node-vault';
const vault = Vault({ endpoint: process.env.VAULT_ADDR });
const secret = await vault.read('secret/data/usdx-wexel/prod/db-password');
```

### Option 2: AWS Secrets Manager
```bash
# Store secret
aws secretsmanager create-secret \
  --name /usdx-wexel/prod/db-password \
  --secret-string "supersecret"

# Read secret (in application)
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: '/usdx-wexel/prod/db-password' });
```

### Option 3: Platform Environment Variables (Simpler, less secure)
- DigitalOcean App Platform
- Vercel
- Heroku
- Stored in platform dashboard
- Injected at runtime

## Configuration Validation

All environment variables are validated on application startup using Joi schemas in:
```
apps/indexer/src/common/config/validation.schema.ts
```

Invalid configuration will prevent the application from starting with a clear error message.

## Security Best Practices

1. **Never commit secrets to git**
   - Use `.gitignore` for `.env` files
   - Scan commits with tools like `git-secrets` or `trufflehog`

2. **Use strong secrets**
   - JWT secrets: min 256 bits (32 bytes)
   - Database passwords: min 20 characters, mixed case, numbers, symbols
   - Generate with: `openssl rand -hex 32`

3. **Principle of least privilege**
   - Grant only necessary permissions
   - Use read-only database users for indexer where possible

4. **Audit and monitor**
   - Enable Vault audit logs
   - Monitor secret access patterns
   - Alert on unusual access

5. **Separate secrets per environment**
   - Different secrets for dev/staging/prod
   - Compromise of one doesn't affect others

6. **Automate rotation**
   - Use automation for regular rotation
   - Document manual rotation procedures

7. **Backup recovery keys**
   - Vault unseal keys in secure offline storage
   - Document recovery procedures

## Troubleshooting

### "Environment variable X is not defined"
1. Check if variable exists in `.env` file (local) or platform settings (deployed)
2. Check variable name spelling
3. Restart application after adding variable

### "Invalid JWT token"
1. Verify `JWT_SECRET` is correctly set
2. Check if secret was recently rotated
3. Clear old tokens from client storage

### "Cannot connect to database"
1. Verify `DATABASE_URL` format
2. Check database is running (local: `docker-compose ps`)
3. Verify network access and firewall rules

## Migration Checklist

When moving to production:
- [ ] Copy `.env.example` to reference
- [ ] Generate strong production secrets (never reuse dev secrets)
- [ ] Set up Vault or Secrets Manager
- [ ] Store all secrets in Vault
- [ ] Configure application to read from Vault
- [ ] Document secret locations and access procedures
- [ ] Set up rotation schedule
- [ ] Enable audit logging
- [ ] Test secret rotation procedure
- [ ] Document incident response for compromised secrets

## Emergency Procedures

### Secret Compromise Response
1. **Immediate**: Rotate compromised secret
2. **Within 1 hour**: 
   - Identify scope of compromise
   - Review audit logs for unauthorized access
   - Notify affected users if needed
3. **Within 24 hours**:
   - Complete root cause analysis
   - Document incident
   - Update procedures to prevent recurrence

### Vault Failure Response
1. **Immediate**: Switch to emergency backup secrets (stored securely offline)
2. **Within 30 min**: Diagnose Vault issue
3. **Within 2 hours**: Restore Vault service or migrate to backup Vault cluster

## References

- [12-Factor App: Config](https://12factor.net/config)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [HashiCorp Vault Documentation](https://www.vaultproject.io/docs)
- [AWS Secrets Manager Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
