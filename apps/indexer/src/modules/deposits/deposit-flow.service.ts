import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { YieldCalculatorService } from '../yield/yield-calculator.service';
import {
  DepositStatus,
  BoostToken,
  PayoutFrequency,
  VaultType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * DepositFlowService - Master v6 Multi-Chain Deposit Flow
 *
 * Manages the complete deposit lifecycle across TRON (USDT) and Solana (Boost + NFT):
 *
 * Flow States:
 * 1. INITIAL - User initiates deposit, backend creates deposit record
 * 2. PENDING_BOOST - USDT tx confirmed, waiting for boost token lock (if applicable)
 * 3. PENDING_MINT - Boost confirmed (or skipped), ready to mint Wexel NFT
 * 4. ACTIVE - Wexel NFT minted, rewards accruing
 * 5. MATURED - Lock period ended, can redeem
 * 6. REDEEMED - NFT burned, principal returned
 *
 * Error States:
 * - USDT_TX_FAILED - USDT transaction verification failed
 * - BOOST_TX_FAILED - Boost token lock failed
 * - MINT_FAILED - Wexel NFT mint failed
 * - EXPIRED - Timeout waiting for next step
 */
@Injectable()
export class DepositFlowService {
  private readonly logger = new Logger(DepositFlowService.name);

  // Timeouts for state transitions (in milliseconds)
  private readonly STATE_TIMEOUTS = {
    INITIAL_TO_PENDING_BOOST: 30 * 60 * 1000, // 30 minutes to confirm USDT
    PENDING_BOOST_TO_PENDING_MINT: 60 * 60 * 1000, // 60 minutes to lock boost
    PENDING_MINT_TO_ACTIVE: 15 * 60 * 1000, // 15 minutes to mint NFT
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly yieldCalculator: YieldCalculatorService,
  ) {}

  /**
   * Step 1: Initiate Deposit
   * Creates a deposit record in INITIAL state
   */
  async initiateDeposit(params: {
    vaultId: number;
    userTronAddress: string;
    userSolanaAddress: string;
    amountUsd: number;
    payoutFrequency: PayoutFrequency;
    wantBoost: boolean;
  }) {
    this.logger.log(
      `Initiating deposit for vault ${params.vaultId}, amount: $${params.amountUsd}`,
    );

    // Fetch vault configuration
    const vault = await this.prisma.vault.findUnique({
      where: { id: params.vaultId },
    });

    if (!vault) {
      throw new BadRequestException('Vault not found');
    }

    if (!vault.is_active) {
      throw new BadRequestException('Vault is not active');
    }

    // Validate minimum deposit
    const minDeposit = Number(vault.min_entry_amount);
    if (params.amountUsd < minDeposit) {
      throw new BadRequestException(`Minimum deposit is $${minDeposit}`);
    }

    // Calculate APY values
    const vaultType = vault.type as 'VAULT_1' | 'VAULT_2' | 'VAULT_3';
    const vaultConfig = this.yieldCalculator.getVaultConfig(vaultType);

    const baseApyBps = vault.base_apy_bps || vaultConfig.baseApyBps;
    const boostApyBps = params.wantBoost
      ? vault.boost_apy_bps || vaultConfig.boostApyBps
      : 0;
    const totalApyBps = baseApyBps + boostApyBps;

    // Calculate frequency multiplier
    const frequencyMultipliers: Record<PayoutFrequency, number> = {
      MONTHLY: 1.0,
      QUARTERLY: 1.15,
      YEARLY: 1.3,
    };
    const multiplier = frequencyMultipliers[params.payoutFrequency];
    const effectiveApyBps = Math.round(totalApyBps * multiplier);

    // Determine boost token type
    const boostToken = params.wantBoost
      ? vault.boost_token_symbol === 'LAIKA'
        ? BoostToken.LAIKA
        : BoostToken.TAKARA
      : BoostToken.NONE;

    // Create deposit record
    const deposit = await this.prisma.deposit.create({
      data: {
        vault_id: params.vaultId,
        vault_batch_number: vault.batch_number,
        user_tron_address: params.userTronAddress,
        user_solana_address: params.userSolanaAddress,
        current_owner_solana: params.userSolanaAddress,
        amount_usd: new Decimal(params.amountUsd),
        deposit_status: DepositStatus.INITIAL,
        payout_frequency: params.payoutFrequency,
        // APY configuration (frozen at deposit time)
        base_apy_bps: baseApyBps,
        boost_apy_bps: boostApyBps,
        total_apy_bps: totalApyBps,
        frequency_multiplier: new Decimal(multiplier),
        effective_apy_bps: effectiveApyBps,
        // Boost configuration
        boost_token: boostToken,
        boost_token_locked: false,
        // Takara mining
        takara_mining_apr_bps: vault.takara_apr_bps || vaultConfig.takaraAprBps,
        takara_pending: new Decimal(0),
        takara_claimed_total: new Decimal(0),
        // USDT rewards
        usdt_claimed_total: new Decimal(0),
        // Legacy compatibility
        user_address: params.userTronAddress,
        status: 'pending',
        network: 'TRON',
        solana_wallet: params.userSolanaAddress,
        is_laika_boosted: boostToken === BoostToken.LAIKA,
        is_takara_boosted: boostToken === BoostToken.TAKARA,
      },
      include: {
        vault: true,
      },
    });

    this.logger.log(
      `Deposit created: ${deposit.id}, status: ${deposit.deposit_status}`,
    );

    // Return deposit info with instructions for next step
    return {
      depositId: deposit.id.toString(),
      status: deposit.deposit_status,
      vault: {
        id: vault.id,
        name: vault.name,
        type: vault.type,
      },
      deposit: {
        amountUsd: params.amountUsd,
        baseApyPercent: baseApyBps / 100,
        boostApyPercent: boostApyBps / 100,
        totalApyPercent: totalApyBps / 100,
        effectiveApyPercent: effectiveApyBps / 100,
        frequency: params.payoutFrequency,
        durationMonths: vault.duration_months,
      },
      nextStep: {
        action: 'SEND_USDT',
        chain: 'TRON',
        recipientAddress: process.env.TRON_DEPOSIT_VAULT_ADDRESS || 'TBD',
        amountUsd: params.amountUsd,
        timeout: this.STATE_TIMEOUTS.INITIAL_TO_PENDING_BOOST,
      },
      boost: params.wantBoost
        ? {
            token: boostToken,
            requirement: this.yieldCalculator.calculateBoostRequirement(
              params.amountUsd,
              vaultType,
            ),
          }
        : null,
    };
  }

  /**
   * Step 2: Confirm USDT Transaction (Tron)
   * Transitions from INITIAL to PENDING_BOOST (or PENDING_MINT if no boost)
   */
  async confirmUsdtTransaction(params: {
    depositId: bigint;
    tronTxHash: string;
  }) {
    this.logger.log(`Confirming USDT tx for deposit ${params.depositId}`);

    const deposit = await this.prisma.deposit.findUnique({
      where: { id: params.depositId },
      include: { vault: true },
    });

    if (!deposit) {
      throw new BadRequestException('Deposit not found');
    }

    if (deposit.deposit_status !== DepositStatus.INITIAL) {
      throw new BadRequestException(`Invalid state: ${deposit.deposit_status}`);
    }

    // TODO: Verify USDT transaction on TRON
    // const verified = await this.tronService.verifyTransaction(params.tronTxHash);

    const nextStatus =
      deposit.boost_token === BoostToken.NONE
        ? DepositStatus.PENDING_MINT
        : DepositStatus.PENDING_BOOST;

    const updated = await this.prisma.deposit.update({
      where: { id: params.depositId },
      data: {
        tron_tx_hash: params.tronTxHash,
        tron_tx_confirmed: true,
        deposit_status: nextStatus,
        status:
          nextStatus === DepositStatus.PENDING_MINT
            ? 'confirmed'
            : 'pending_boost',
        updated_at: new Date(),
      },
      include: { vault: true },
    });

    this.logger.log(
      `USDT confirmed for ${params.depositId}, new status: ${nextStatus}`,
    );

    return {
      depositId: updated.id.toString(),
      status: updated.deposit_status,
      tronTxHash: params.tronTxHash,
      nextStep:
        nextStatus === DepositStatus.PENDING_BOOST
          ? {
              action: 'LOCK_BOOST_TOKEN',
              chain: 'SOLANA',
              boostToken: updated.boost_token,
              timeout: this.STATE_TIMEOUTS.PENDING_BOOST_TO_PENDING_MINT,
            }
          : {
              action: 'MINT_WEXEL_NFT',
              chain: 'SOLANA',
              timeout: this.STATE_TIMEOUTS.PENDING_MINT_TO_ACTIVE,
            },
    };
  }

  /**
   * Step 3: Confirm Boost Token Lock (Solana)
   * Transitions from PENDING_BOOST to PENDING_MINT
   */
  async confirmBoostLock(params: {
    depositId: bigint;
    boostTxSignature: string;
    boostTokenMint: string;
    boostTokenAmount: number;
    boostPriceAtDeposit: number;
  }) {
    this.logger.log(`Confirming boost lock for deposit ${params.depositId}`);

    const deposit = await this.prisma.deposit.findUnique({
      where: { id: params.depositId },
    });

    if (!deposit) {
      throw new BadRequestException('Deposit not found');
    }

    if (deposit.deposit_status !== DepositStatus.PENDING_BOOST) {
      throw new BadRequestException(`Invalid state: ${deposit.deposit_status}`);
    }

    // TODO: Verify boost lock on Solana
    // const verified = await this.solanaService.verifyBoostLock(params.boostTxSignature);

    const updated = await this.prisma.deposit.update({
      where: { id: params.depositId },
      data: {
        boost_tx_signature: params.boostTxSignature,
        boost_tx_confirmed: true,
        boost_token_mint: params.boostTokenMint,
        boost_token_amount: new Decimal(params.boostTokenAmount),
        boost_token_locked: true,
        boost_price_at_deposit: new Decimal(params.boostPriceAtDeposit),
        deposit_status: DepositStatus.PENDING_MINT,
        status: 'pending_mint',
        updated_at: new Date(),
      },
    });

    this.logger.log(`Boost confirmed for ${params.depositId}, ready to mint`);

    return {
      depositId: updated.id.toString(),
      status: updated.deposit_status,
      boostTxSignature: params.boostTxSignature,
      nextStep: {
        action: 'MINT_WEXEL_NFT',
        chain: 'SOLANA',
        timeout: this.STATE_TIMEOUTS.PENDING_MINT_TO_ACTIVE,
      },
    };
  }

  /**
   * Step 4: Mint Wexel NFT (Solana)
   * Transitions from PENDING_MINT to ACTIVE
   */
  async confirmWexelMint(params: {
    depositId: bigint;
    mintTxSignature: string;
    wexelMintAddress: string;
    wexelMetadataUri: string;
  }) {
    this.logger.log(`Confirming Wexel mint for deposit ${params.depositId}`);

    const deposit = await this.prisma.deposit.findUnique({
      where: { id: params.depositId },
      include: { vault: true },
    });

    if (!deposit) {
      throw new BadRequestException('Deposit not found');
    }

    if (deposit.deposit_status !== DepositStatus.PENDING_MINT) {
      throw new BadRequestException(`Invalid state: ${deposit.deposit_status}`);
    }

    // Calculate lock dates
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + deposit.vault.duration_months);

    const updated = await this.prisma.deposit.update({
      where: { id: params.depositId },
      data: {
        mint_tx_signature: params.mintTxSignature,
        wexel_mint_address: params.wexelMintAddress,
        wexel_metadata_uri: params.wexelMetadataUri,
        deposit_status: DepositStatus.ACTIVE,
        lock_start_at: now,
        lock_end_at: endDate,
        status: 'active',
        updated_at: new Date(),
      },
      include: { vault: true },
    });

    // Update vault liquidity
    await this.prisma.vault.update({
      where: { id: deposit.vault_id },
      data: {
        current_liquidity: {
          increment: deposit.amount_usd,
        },
        total_wexels: {
          increment: BigInt(1),
        },
      },
    });

    this.logger.log(
      `Wexel minted for ${params.depositId}, deposit is now ACTIVE`,
    );

    return {
      depositId: updated.id.toString(),
      status: updated.deposit_status,
      wexelMintAddress: params.wexelMintAddress,
      lockStartAt: updated.lock_start_at,
      lockEndAt: updated.lock_end_at,
      apy: {
        basePercent: updated.base_apy_bps / 100,
        boostPercent: updated.boost_apy_bps / 100,
        effectivePercent: updated.effective_apy_bps / 100,
      },
    };
  }

  /**
   * Get deposit status with full details
   */
  async getDepositStatus(depositId: bigint) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      include: { vault: true },
    });

    if (!deposit) {
      throw new BadRequestException('Deposit not found');
    }

    return this.formatDepositResponse(deposit);
  }

  /**
   * Get all deposits for a user
   */
  async getUserDeposits(userAddress: string) {
    const deposits = await this.prisma.deposit.findMany({
      where: {
        OR: [
          { user_tron_address: userAddress },
          { user_solana_address: userAddress },
          { current_owner_solana: userAddress },
        ],
      },
      include: { vault: true },
      orderBy: { created_at: 'desc' },
    });

    return deposits.map((d) => this.formatDepositResponse(d));
  }

  /**
   * Handle state expiration
   * Called by cron job to transition expired deposits to error states
   */
  async handleExpiredDeposits() {
    const now = new Date();

    // Find INITIAL deposits that haven't confirmed USDT in time
    const expiredInitial = await this.prisma.deposit.updateMany({
      where: {
        deposit_status: DepositStatus.INITIAL,
        created_at: {
          lt: new Date(
            now.getTime() - this.STATE_TIMEOUTS.INITIAL_TO_PENDING_BOOST,
          ),
        },
      },
      data: {
        deposit_status: DepositStatus.EXPIRED,
        status: 'expired',
        updated_at: now,
      },
    });

    if (expiredInitial.count > 0) {
      this.logger.warn(`Expired ${expiredInitial.count} INITIAL deposits`);
    }

    // Similar for other states...
    return { expiredInitial: expiredInitial.count };
  }

  /**
   * Format deposit for API response
   */
  private formatDepositResponse(deposit: any) {
    const isMatured = deposit.lock_end_at && new Date() >= deposit.lock_end_at;

    return {
      id: deposit.id.toString(),
      status: deposit.deposit_status,
      vault: {
        id: deposit.vault?.id,
        name: deposit.vault?.name,
        type: deposit.vault?.type,
      },
      user: {
        tronAddress: deposit.user_tron_address,
        solanaAddress: deposit.user_solana_address,
        currentOwnerSolana: deposit.current_owner_solana,
      },
      amount: {
        usd: Number(deposit.amount_usd),
      },
      apy: {
        basePercent: deposit.base_apy_bps / 100,
        boostPercent: deposit.boost_apy_bps / 100,
        totalPercent: deposit.total_apy_bps / 100,
        frequencyMultiplier: Number(deposit.frequency_multiplier),
        effectivePercent: deposit.effective_apy_bps / 100,
        frequency: deposit.payout_frequency,
      },
      boost: {
        token: deposit.boost_token,
        tokenMint: deposit.boost_token_mint,
        amount: deposit.boost_token_amount
          ? Number(deposit.boost_token_amount)
          : null,
        locked: deposit.boost_token_locked,
        priceAtDeposit: deposit.boost_price_at_deposit
          ? Number(deposit.boost_price_at_deposit)
          : null,
      },
      wexel: {
        mintAddress: deposit.wexel_mint_address,
        metadataUri: deposit.wexel_metadata_uri,
      },
      transactions: {
        tronTxHash: deposit.tron_tx_hash,
        tronConfirmed: deposit.tron_tx_confirmed,
        boostTxSignature: deposit.boost_tx_signature,
        boostConfirmed: deposit.boost_tx_confirmed,
        mintTxSignature: deposit.mint_tx_signature,
      },
      timing: {
        lockStartAt: deposit.lock_start_at,
        lockEndAt: deposit.lock_end_at,
        isMatured,
        createdAt: deposit.created_at,
        updatedAt: deposit.updated_at,
      },
      rewards: {
        takaraAprPercent: deposit.takara_mining_apr_bps / 100,
        takaraPending: Number(deposit.takara_pending),
        takaraClaimedTotal: Number(deposit.takara_claimed_total),
        usdtClaimedTotal: Number(deposit.usdt_claimed_total),
      },
      claimNonce: deposit.claim_nonce,
    };
  }
}
