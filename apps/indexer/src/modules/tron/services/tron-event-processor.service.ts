import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { TronBridgeService } from './tron-bridge.service';

/**
 * Processes events from Tron smart contracts
 */
@Injectable()
export class TronEventProcessor {
  private readonly logger = new Logger(TronEventProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly bridgeService: TronBridgeService,
  ) {}

  /**
   * Process TronDepositVault events
   */
  async processDepositVaultEvent(event: any) {
    const eventName = event.event_name || event.name;

    switch (eventName) {
      case 'DepositCreated':
        await this.handleDepositCreated(event);
        break;
      case 'DepositProcessed':
        await this.handleDepositProcessed(event);
        break;
      case 'PoolCreated':
        await this.handlePoolCreated(event);
        break;
      case 'PoolUpdated':
        await this.handlePoolUpdated(event);
        break;
      case 'MinDepositUpdated':
        this.logger.log('MinDepositUpdated event processed');
        break;
      default:
        this.logger.warn(`Unknown DepositVault event: ${eventName}`);
    }
  }

  /**
   * Process TronPriceFeed events
   */
  async processPriceFeedEvent(event: any) {
    const eventName = event.event_name || event.name;

    switch (eventName) {
      case 'PriceUpdated':
        await this.handlePriceUpdated(event);
        break;
      case 'ManualPriceSet':
        await this.handleManualPriceSet(event);
        break;
      case 'TokenAdded':
        this.logger.log('TokenAdded event processed');
        break;
      default:
        this.logger.warn(`Unknown PriceFeed event: ${eventName}`);
    }
  }

  /**
   * Process BridgeProxy events
   */
  async processBridgeEvent(event: any) {
    const eventName = event.event_name || event.name;

    switch (eventName) {
      case 'MessageCreated':
        await this.handleMessageCreated(event);
        break;
      case 'MessageConfirmed':
        await this.handleMessageConfirmed(event);
        break;
      case 'MessageProcessed':
        await this.handleMessageProcessed(event);
        break;
      case 'DepositBridged':
        await this.handleDepositBridged(event);
        break;
      case 'WexelMinted':
        await this.handleWexelMinted(event);
        break;
      default:
        this.logger.warn(`Unknown Bridge event: ${eventName}`);
    }
  }

  /**
   * Process TronWexel721 events
   */
  async processWexel721Event(event: any) {
    const eventName = event.event_name || event.name;

    switch (eventName) {
      case 'WexelMinted':
        await this.handleTronWexelMinted(event);
        break;
      case 'CollateralFlagSet':
        await this.handleCollateralFlagSet(event);
        break;
      case 'WexelRedeemed':
        await this.handleTronWexelRedeemed(event);
        break;
      case 'Transfer':
        this.logger.log('Transfer event processed');
        break;
      default:
        this.logger.warn(`Unknown Wexel721 event: ${eventName}`);
    }
  }

  /**
   * Handle DepositCreated event
   */
  private async handleDepositCreated(event: any) {
    const {
      depositId,
      depositor,
      poolId,
      amount,
      solanaOwner,
      timestamp,
    } = event.result;

    this.logger.log(
      `Deposit created: ${depositId} by ${depositor} (${amount} USDT)`,
    );

    try {
      // Store deposit in database
      // Note: You may need to add a tron_deposits table to Prisma schema
      await this.prisma.$executeRaw`
        INSERT INTO tron_deposits (
          deposit_id, 
          depositor, 
          pool_id, 
          amount, 
          solana_owner, 
          timestamp,
          tx_hash,
          processed
        ) VALUES (
          ${depositId.toString()},
          ${depositor},
          ${poolId},
          ${amount.toString()},
          ${solanaOwner},
          ${new Date(parseInt(timestamp) * 1000)},
          ${event.transaction_id},
          false
        )
        ON CONFLICT (deposit_id) DO NOTHING
      `;

      // Trigger bridge process
      await this.bridgeService.bridgeDepositToSolana({
        depositId: depositId.toString(),
        tronAddress: depositor,
        solanaOwner,
        amount: amount.toString(),
        poolId,
      });
    } catch (error) {
      this.logger.error(`Error handling DepositCreated: ${error.message}`);
    }
  }

  /**
   * Handle DepositProcessed event
   */
  private async handleDepositProcessed(event: any) {
    const { depositId, wexelId } = event.result;

    this.logger.log(
      `Deposit ${depositId} processed with Wexel ID ${wexelId}`,
    );

    try {
      await this.prisma.$executeRaw`
        UPDATE tron_deposits 
        SET processed = true, wexel_id = ${wexelId.toString()}
        WHERE deposit_id = ${depositId.toString()}
      `;
    } catch (error) {
      this.logger.error(`Error handling DepositProcessed: ${error.message}`);
    }
  }

  /**
   * Handle PoolCreated event
   */
  private async handlePoolCreated(event: any) {
    const { poolId, apyBasisPoints, lockMonths } = event.result;

    this.logger.log(
      `Pool created: ${poolId} (APY: ${apyBasisPoints}bp, Lock: ${lockMonths}m)`,
    );

    // Pool info might be synced or managed separately
  }

  /**
   * Handle PoolUpdated event
   */
  private async handlePoolUpdated(event: any) {
    const { poolId, isActive } = event.result;
    this.logger.log(`Pool ${poolId} updated: ${isActive ? 'active' : 'inactive'}`);
  }

  /**
   * Handle PriceUpdated event
   */
  private async handlePriceUpdated(event: any) {
    const { token, price, confidence, timestamp } = event.result;

    this.logger.log(`Price updated for ${token}: $${price} (confidence: ${confidence})`);

    // Store price update for oracle tracking
  }

  /**
   * Handle ManualPriceSet event
   */
  private async handleManualPriceSet(event: any) {
    const { token, price, setter, reason } = event.result;

    this.logger.log(
      `Manual price set for ${token}: $${price} by ${setter} (reason: ${reason})`,
    );
  }

  /**
   * Handle MessageCreated event
   */
  private async handleMessageCreated(event: any) {
    const { messageId, messageType, sourceChain, targetChain, payload } =
      event.result;

    this.logger.log(
      `Bridge message created: ${messageId} (${sourceChain} -> ${targetChain})`,
    );

    // Store message for cross-chain tracking
  }

  /**
   * Handle MessageConfirmed event
   */
  private async handleMessageConfirmed(event: any) {
    const { messageId, validator, totalConfirmations } = event.result;

    this.logger.log(
      `Message ${messageId} confirmed by ${validator} (${totalConfirmations} confirmations)`,
    );
  }

  /**
   * Handle MessageProcessed event
   */
  private async handleMessageProcessed(event: any) {
    const { messageId, targetChain } = event.result;

    this.logger.log(`Message ${messageId} processed on ${targetChain}`);
  }

  /**
   * Handle DepositBridged event
   */
  private async handleDepositBridged(event: any) {
    const { depositId, solanaOwner, amount, poolId } = event.result;

    this.logger.log(
      `Deposit ${depositId} bridged to Solana for ${solanaOwner}`,
    );
  }

  /**
   * Handle WexelMinted event (from BridgeProxy)
   */
  private async handleWexelMinted(event: any) {
    const { wexelId, depositId, solanaOwner } = event.result;

    this.logger.log(
      `Wexel ${wexelId} minted on Solana for deposit ${depositId}`,
    );

    try {
      await this.prisma.$executeRaw`
        UPDATE tron_deposits 
        SET wexel_id = ${wexelId.toString()}, processed = true
        WHERE deposit_id = ${depositId.toString()}
      `;
    } catch (error) {
      this.logger.error(`Error handling WexelMinted: ${error.message}`);
    }
  }

  /**
   * Handle TronWexel NFT minted
   */
  private async handleTronWexelMinted(event: any) {
    const { tokenId, to, solanaHash, principalUsd, apyBasisPoints } =
      event.result;

    this.logger.log(`Tron Wexel NFT ${tokenId} minted for ${to}`);
  }

  /**
   * Handle CollateralFlagSet
   */
  private async handleCollateralFlagSet(event: any) {
    const { tokenId, isCollateralized } = event.result;

    this.logger.log(
      `Tron Wexel ${tokenId} collateral flag: ${isCollateralized}`,
    );
  }

  /**
   * Handle TronWexelRedeemed
   */
  private async handleTronWexelRedeemed(event: any) {
    const { tokenId } = event.result;

    this.logger.log(`Tron Wexel ${tokenId} redeemed`);
  }
}
