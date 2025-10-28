import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

interface BlockchainEvent {
  chain: string;
  txHash: string;
  eventType: string;
  data: any;
  slot?: number;
}

@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Process blockchain event and update database
   */
  async processEvent(event: BlockchainEvent) {
    this.logger.log(`Processing event: ${event.eventType} from tx ${event.txHash}`);

    try {
      switch (event.eventType) {
        case 'WexelCreated':
          await this.handleWexelCreated(event);
          break;

        case 'BoostApplied':
          await this.handleBoostApplied(event);
          break;

        case 'Accrued':
          await this.handleAccrued(event);
          break;

        case 'Claimed':
          await this.handleClaimed(event);
          break;

        case 'Collateralized':
          await this.handleCollateralized(event);
          break;

        case 'LoanRepaid':
          await this.handleLoanRepaid(event);
          break;

        case 'Redeemed':
          await this.handleRedeemed(event);
          break;

        case 'WexelFinalized':
          await this.handleWexelFinalized(event);
          break;

        default:
          this.logger.warn(`Unknown event type: ${event.eventType}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process event ${event.eventType}`, error);
      throw error;
    }
  }

  /**
   * Handle WexelCreated event
   */
  private async handleWexelCreated(event: BlockchainEvent) {
    const { id, owner, principal_usd, apy_bp, lock_period_months, created_at } = event.data;

    // Calculate end timestamp
    const startTs = new Date(created_at * 1000);
    const endTs = new Date(startTs.getTime() + lock_period_months * 30 * 24 * 60 * 60 * 1000);

    await this.prisma.wexel.upsert({
      where: { id: BigInt(id) },
      create: {
        id: BigInt(id),
        owner_solana: owner,
        pool_id: 1, // TODO: Get from event or map
        principal_usd: BigInt(principal_usd),
        apy_base_bp: apy_bp,
        apy_boost_bp: 0,
        start_ts: startTs,
        end_ts: endTs,
        is_collateralized: false,
        total_claimed_usd: BigInt(0),
        nft_mint_address: null, // TODO: Get from transaction
      },
      update: {
        principal_usd: BigInt(principal_usd),
        apy_base_bp: apy_bp,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Wexel ${id} created/updated`);
  }

  /**
   * Handle BoostApplied event
   */
  private async handleBoostApplied(event: BlockchainEvent) {
    const { wexel_id, apy_boost_bp, value_usd } = event.data;

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: BigInt(wexel_id) },
      data: {
        apy_boost_bp: apy_boost_bp,
        updated_at: new Date(),
      },
    });

    // Create boost record
    await this.prisma.boost.create({
      data: {
        wexel_id: BigInt(wexel_id),
        token_mint: 'unknown', // TODO: Get from transaction
        amount: BigInt(0), // TODO: Get from transaction
        value_usd: BigInt(value_usd),
        apy_boost_bp: apy_boost_bp,
        price_usd: BigInt(0), // TODO: Calculate
      },
    });

    this.logger.log(`Boost applied to wexel ${wexel_id}`);
  }

  /**
   * Handle Accrued event
   */
  private async handleAccrued(event: BlockchainEvent) {
    const { wexel_id, reward_usd } = event.data;
    this.logger.log(`Rewards accrued for wexel ${wexel_id}: ${reward_usd}`);
    // Rewards are calculated on-demand, no DB update needed
  }

  /**
   * Handle Claimed event
   */
  private async handleClaimed(event: BlockchainEvent) {
    const { wexel_id, to, amount_usd } = event.data;

    // Create claim record
    await this.prisma.claim.create({
      data: {
        wexel_id: BigInt(wexel_id),
        amount_usd: BigInt(amount_usd),
        claim_type: 'manual',
        tx_hash: event.txHash,
      },
    });

    // Update wexel
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(wexel_id) },
    });

    if (wexel) {
      await this.prisma.wexel.update({
        where: { id: BigInt(wexel_id) },
        data: {
          total_claimed_usd: wexel.total_claimed_usd + BigInt(amount_usd),
          updated_at: new Date(),
        },
      });
    }

    this.logger.log(`Rewards claimed for wexel ${wexel_id}: ${amount_usd}`);
  }

  /**
   * Handle Collateralized event
   */
  private async handleCollateralized(event: BlockchainEvent) {
    const { wexel_id, loan_usd, ltv_bp } = event.data;

    // Create collateral position
    await this.prisma.collateralPosition.upsert({
      where: { wexel_id: BigInt(wexel_id) },
      create: {
        wexel_id: BigInt(wexel_id),
        loan_usd: BigInt(loan_usd),
        start_ts: new Date(),
        repaid: false,
      },
      update: {
        loan_usd: BigInt(loan_usd),
        repaid: false,
        updated_at: new Date(),
      },
    });

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: BigInt(wexel_id) },
      data: {
        is_collateralized: true,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Wexel ${wexel_id} collateralized with loan ${loan_usd}`);
  }

  /**
   * Handle LoanRepaid event
   */
  private async handleLoanRepaid(event: BlockchainEvent) {
    const { wexel_id, repaid_amount } = event.data;

    // Update collateral position
    await this.prisma.collateralPosition.update({
      where: { wexel_id: BigInt(wexel_id) },
      data: {
        repaid: true,
        updated_at: new Date(),
      },
    });

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: BigInt(wexel_id) },
      data: {
        is_collateralized: false,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Loan repaid for wexel ${wexel_id}`);
  }

  /**
   * Handle Redeemed event
   */
  private async handleRedeemed(event: BlockchainEvent) {
    const { wexel_id, principal_usd } = event.data;
    this.logger.log(`Wexel ${wexel_id} redeemed: ${principal_usd}`);
    // Could mark wexel as redeemed if we add that field
  }

  /**
   * Handle WexelFinalized event
   */
  private async handleWexelFinalized(event: BlockchainEvent) {
    const { wexel_id } = event.data;
    this.logger.log(`Wexel ${wexel_id} finalized`);
    // Could mark wexel as finalized if we add that field
  }
}
