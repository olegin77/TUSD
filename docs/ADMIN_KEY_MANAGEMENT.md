# Admin Key Management

## Overview

This document describes the management of administrative keys for the USDX/Wexel platform, including multisig wallets and timelock mechanisms for enhanced security.

## Architecture

### Multisig Wallet

**Purpose**: Require multiple signers to approve critical administrative actions

**Implementation**:

- **Solana**: Squads Protocol or Realms DAO
- **Tron**: Gnosis Safe equivalent or native multi-signature

**Configuration**:

- **Signers**: 5 total (3 of 5 required for execution)
- **Threshold**: 3/5 (60% consensus)
- **Key holders**:
  1. CTO/Technical Lead
  2. CEO/Founder
  3. Security Officer
  4. External Auditor/Advisor
  5. Cold wallet backup (offline, for emergency recovery)

### Timelock Contract

**Purpose**: Delay execution of approved transactions to allow for monitoring and emergency cancellation

**Configuration**:

- **Delay Period**: 48 hours (2 days)
- **Grace Period**: 7 days (time window to execute after delay)
- **Minimum Delay**: 12 hours (cannot be shorter)
- **Maximum Delay**: 30 days (cannot be longer)

**Exceptions** (immediate execution, no timelock):

- Emergency pause functions
- Unpause functions (still require multisig)

## Administrative Functions Requiring Multisig + Timelock

### High Risk Operations

- Update program/contract code (upgrade)
- Change admin addresses
- Modify multisig configuration
- Transfer program authority
- Drain contract funds (emergency only)

### Medium Risk Operations

- Update APY rates
- Add/remove supported tokens
- Modify fee structures
- Change marketplace commission
- Update boost parameters

### Low Risk Operations (Multisig only, no timelock)

- Update oracle price feeds
- Pause/unpause system components
- Update metadata URIs
- Modify display parameters

## Addresses

### Solana Mainnet

```bash
# Multisig (Squads)
ADMIN_MULTISIG_ADDRESS=<TBD - will be generated during setup>

# Timelock
TIMELOCK_ADDRESS=<TBD - will be deployed>

# Pause Guardian (can pause, but not unpause)
PAUSE_GUARDIAN_ADDRESS=<TBD - separate 2/3 multisig>

# Individual Signer Addresses (DO NOT SHARE PUBLICLY)
SIGNER_1=<redacted>
SIGNER_2=<redacted>
SIGNER_3=<redacted>
SIGNER_4=<redacted>
SIGNER_5=<redacted - cold wallet>
```

### Tron Mainnet

```bash
# Multisig (Gnosis Safe equivalent)
ADMIN_MULTISIG_ADDRESS_TRON=<TBD>

# Timelock
TIMELOCK_ADDRESS_TRON=<TBD>

# Pause Guardian
PAUSE_GUARDIAN_ADDRESS_TRON=<TBD>
```

## Setup Procedures

### 1. Creating Multisig Wallet (Solana - Squads Protocol)

```bash
# Install Squads CLI
npm install -g @sqds/cli

# Create new squad
squads create-squad \
  --threshold 3 \
  --members <addr1>,<addr2>,<addr3>,<addr4>,<addr5> \
  --name "USDX-Wexel Admin Multisig"

# Verify squad creation
squads get-squad <squad-address>
```

### 2. Deploying Timelock Contract

```bash
# Deploy timelock with multisig as admin
anchor deploy --program-name timelock \
  --provider.cluster mainnet \
  --provider.wallet <multisig-keypair>

# Initialize timelock
anchor run initialize-timelock \
  --args '{"admin": "<multisig-address>", "delay": 172800}' # 48 hours
```

### 3. Transferring Program Authority

```bash
# Transfer each program's upgrade authority to timelock
solana program set-upgrade-authority <program-id> \
  --new-upgrade-authority <timelock-address>

# Verify transfer
solana program show <program-id>
```

### 4. Setting Up Pause Guardian

```bash
# Create separate 2/3 multisig for pause guardian
squads create-squad \
  --threshold 2 \
  --members <guard1>,<guard2>,<guard3> \
  --name "USDX-Wexel Pause Guardian"

# Grant pause authority (but not unpause)
anchor run set-pause-authority \
  --args '{"guardian": "<pause-guardian-address>"}'
```

## Operational Procedures

### Proposing an Administrative Action

1. **Draft Proposal**
   - Document the change and rationale
   - Include technical details and impact analysis
   - Share with all signers for review

2. **Technical Review**
   - Security team reviews for vulnerabilities
   - Dev team reviews implementation
   - Test on devnet first

3. **Create Transaction**

   ```bash
   # Create proposal in Squads
   squads create-transaction \
     --squad <squad-address> \
     --instructions <instruction-file.json> \
     --description "Update Pool APY from 18% to 20%"
   ```

4. **Gather Signatures**
   - Share proposal link with all signers
   - Each signer reviews independently
   - Minimum 3/5 signers approve

5. **Execute Transaction**

   ```bash
   # After 3 signatures, execute
   squads execute-transaction \
     --squad <squad-address> \
     --transaction <tx-id>
   ```

6. **Monitor Timelock**
   - Transaction enters 48-hour timelock
   - Monitor for any issues
   - Community has time to review on-chain

7. **Final Execution**
   ```bash
   # After timelock delay, execute
   squads execute-timelock \
     --timelock <timelock-address> \
     --transaction <tx-id>
   ```

### Emergency Pause Procedure

**Trigger**: Critical bug, exploit, or security incident detected

**Process**:

1. **Immediate Action** (any pause guardian signer)

   ```bash
   anchor run emergency-pause \
     --guardian-key <guardian-keypair>
   ```

   - No timelock required
   - Can be executed by 1/3 guardians individually
   - Immediately halts all sensitive operations

2. **Assessment** (within 1 hour)
   - Investigate root cause
   - Assess scope of impact
   - Determine fix or mitigation

3. **Communication** (within 2 hours)
   - Notify community via Twitter, Discord, Telegram
   - Publish incident report
   - Provide timeline for resolution

4. **Fix and Unpause** (after resolution)
   - Deploy fix (requires multisig + timelock)
   - Test thoroughly on devnet
   - Propose unpause transaction
   - Execute unpause (requires multisig)

### Rotating Signer Keys

**Trigger**: Compromised key, personnel change, or routine rotation (annually)

**Process**:

1. **Generate New Key**

   ```bash
   solana-keygen new --outfile new-signer.json
   ```

2. **Propose Signer Change**

   ```bash
   squads create-transaction \
     --squad <squad-address> \
     --instruction replace-signer \
     --args '{"old": "<old-pubkey>", "new": "<new-pubkey>"}'
   ```

3. **Execute Change** (requires 3/5 signatures + timelock)

4. **Verify Update**

   ```bash
   squads get-squad <squad-address>
   # Confirm new signer is listed
   ```

5. **Securely Destroy Old Key**
   - Overwrite key file: `shred -uvz old-signer.json`
   - Document rotation in security log

## Key Storage Best Practices

### Hot Wallets (Signers 1-4)

- **Hardware Wallets**: Ledger Nano X or Trezor Model T
- **Location**: Physically secured, distributed geographically
- **Access**: Individual key holders only, with 2FA backup
- **Backup**: Seed phrase in secure offline storage (e.g., safety deposit box)

### Cold Wallet (Signer 5)

- **Air-Gapped Computer**: Never connected to internet
- **Location**: Bank vault or equivalent
- **Access**: Dual control (require 2 people to access)
- **Backup**: Multiple copies of seed phrase in geographically distributed secure locations
- **Usage**: Emergency recovery only

### Key Backup Procedures

1. Write seed phrase on metal plates (fire/water resistant)
2. Store in multiple secure locations
3. Use Shamir Secret Sharing (optional, advanced)
4. Test recovery process annually

## Monitoring and Auditing

### On-Chain Monitoring

- Monitor multisig address for all transactions
- Alert on any proposed transactions
- Dashboard showing pending proposals and timelock status

### Audit Logs

- Maintain off-chain log of all proposals
- Record: timestamp, proposer, action, signers, execution time
- Review quarterly for anomalies

### Metrics to Track

- Time between proposal and execution
- Number of rejected proposals
- Signer participation rates
- Time taken for each signer to approve

## Incident Response Plan

### Compromised Signer Key

1. **Immediate**: Other signers propose removal of compromised key
2. **Within 4 hours**: Execute removal (if possible before attacker can act)
3. **Within 24 hours**: Add new signer key
4. **Post-incident**: Investigate how compromise occurred, update procedures

### Compromised Multisig

1. **Immediate**: Activate pause guardian, halt all operations
2. **Within 1 hour**: Assess damage, determine if funds at risk
3. **Within 6 hours**: If possible, use cold wallet to create new multisig and transfer authority
4. **Post-incident**: Full security audit, public disclosure

### Lost Keys (Cannot Reach Threshold)

1. **Immediate**: Attempt to contact all signers
2. **Within 12 hours**: If <3 signers available, activate contingency multisig (requires cold wallet signer)
3. **Within 48 hours**: Restore access or create new multisig
4. **Post-incident**: Review and improve key management procedures

## Testing and Drills

### Quarterly Tests

- Test multisig proposal and execution flow
- Verify timelock delays are working correctly
- Practice emergency pause and unpause

### Annual Exercises

- Full key rotation drill
- Cold wallet recovery exercise
- Incident response tabletop exercise

## Compliance and Governance

### Change Log

All changes to admin key configuration must be logged:

- Date/time
- Change made
- Reason
- Approved by (all signers)

### Governance Proposals

For major changes (e.g., modifying threshold), require:

1. Community governance proposal
2. 7-day discussion period
3. On-chain vote (if DAO implemented)
4. Multisig execution with extended timelock (7 days)

## Documentation Maintenance

This document should be reviewed and updated:

- **Quarterly**: Verify all addresses and procedures current
- **After Any Incident**: Update lessons learned
- **Annually**: Full review with security audit
- **On Personnel Changes**: Update signer information

## Contact Information

**Emergency Security Hotline**: [TBD]  
**Security Email**: security@wexel.com [TBD]  
**PGP Key**: [TBD]

---

**Last Updated**: 2025-10-28  
**Next Review**: 2026-01-28  
**Document Owner**: Security Team
