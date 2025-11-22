# Mock Solana Deployment Configuration

**ВАЖНО**: Это временные mock Program IDs для интеграции Frontend/Backend.
Реальная компиляция контрактов отложена из-за конфликта Rust версий.

## Generated Mock Identifiers

### Program ID (Devnet Mock)
```
3U9nvLEhTGEinHwiHtkAnbovbHK4GXpkbJon1Xko7wYS
```

### Boost Token Mint Address
```
5fohKkBVtCeiDzSCQg43tMYjx6C3rxnCJze4kbddnq4S
```

## Configuration Updates Required

### 1. Backend Indexer (/root/TUSD/apps/indexer/.env)
```bash
SOLANA_PROGRAM_ID=3U9nvLEhTGEinHwiHtkAnbovbHK4GXpkbJon1Xko7wYS
SOLANA_BOOST_MINT_ADDRESS=5fohKkBVtCeiDzSCQg43tMYjx6C3rxnCJze4kbddnq4S
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
```

### 2. Frontend Configuration
Update appropriate config files in `/root/TUSD/apps/webapp`

## Next Steps

1. ✅ Mock IDs generated
2. ⏳ Update Indexer .env
3. ⏳ Update Frontend config
4. ⏳ Restart services
5. ⏳ Setup Nginx & SSL
6. ⏸️ Compile real contracts (deferred until toolchain resolved)

## Deferred: Real Contract Compilation

**Issue**: Rust version conflict
- Solana platform-tools v1.41 uses Rust 1.75.0-dev
- Anchor 0.32.1 dependencies require Rust 1.76+

**Solutions**:
- Option A: Compile on compatible machine, upload .so file
- Option B: Upgrade to Solana Agave 2.0
- Option C: Downgrade Anchor dependencies

---
Generated: 20 Noyabr, 2025 yil, Payshanba
Server: 159.203.114.210
Network: Devnet (Mock)
