import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

/**
 * Service for managing notifications
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly gateway: NotificationsGateway) {}

  /**
   * Notify about wexel creation
   */
  notifyWexelCreated(data: {
    wexelId: number;
    owner: string;
    principalUsd: string;
    apyBp: number;
  }) {
    this.logger.log(`Notifying wexel created: ${data.wexelId}`);
    
    // Notify the owner
    this.gateway.emitToUser(data.owner, 'wexel:created', data);
    
    // Broadcast to marketplace
    this.gateway.emitToMarketplace('wexel:created', {
      wexelId: data.wexelId,
      principalUsd: data.principalUsd,
    });
  }

  /**
   * Notify about boost applied
   */
  notifyBoostApplied(data: {
    wexelId: number;
    owner: string;
    apyBoostBp: number;
    valueUsd: string;
  }) {
    this.logger.log(`Notifying boost applied: wexel ${data.wexelId}`);
    
    this.gateway.emitToUser(data.owner, 'wexel:boost_applied', data);
    this.gateway.emitToWexel(data.wexelId, 'wexel:boost_applied', data);
  }

  /**
   * Notify about rewards accrued
   */
  notifyRewardsAccrued(data: {
    wexelId: number;
    owner: string;
    rewardUsd: string;
  }) {
    this.logger.debug(`Notifying rewards accrued: wexel ${data.wexelId}`);
    
    this.gateway.emitToUser(data.owner, 'wexel:rewards_accrued', data);
    this.gateway.emitToWexel(data.wexelId, 'wexel:rewards_accrued', data);
  }

  /**
   * Notify about claim
   */
  notifyClaimed(data: {
    wexelId: number;
    owner: string;
    amountUsd: string;
  }) {
    this.logger.log(`Notifying claim: wexel ${data.wexelId}`);
    
    this.gateway.emitToUser(data.owner, 'wexel:claimed', data);
    this.gateway.emitToWexel(data.wexelId, 'wexel:claimed', data);
  }

  /**
   * Notify about collateralization
   */
  notifyCollateralized(data: {
    wexelId: number;
    owner: string;
    loanUsd: string;
    ltvBp: number;
  }) {
    this.logger.log(`Notifying collateralized: wexel ${data.wexelId}`);
    
    this.gateway.emitToUser(data.owner, 'wexel:collateralized', data);
    this.gateway.emitToWexel(data.wexelId, 'wexel:collateralized', data);
  }

  /**
   * Notify about loan repayment
   */
  notifyLoanRepaid(data: {
    wexelId: number;
    owner: string;
    repaidAmount: string;
  }) {
    this.logger.log(`Notifying loan repaid: wexel ${data.wexelId}`);
    
    this.gateway.emitToUser(data.owner, 'wexel:loan_repaid', data);
    this.gateway.emitToWexel(data.wexelId, 'wexel:loan_repaid', data);
  }

  /**
   * Notify about wexel redemption
   */
  notifyRedeemed(data: {
    wexelId: number;
    owner: string;
    principalUsd: string;
  }) {
    this.logger.log(`Notifying redeemed: wexel ${data.wexelId}`);
    
    this.gateway.emitToUser(data.owner, 'wexel:redeemed', data);
    this.gateway.emitToWexel(data.wexelId, 'wexel:redeemed', data);
  }

  /**
   * Notify about listing creation
   */
  notifyListingCreated(data: {
    listingId: number;
    wexelId: number;
    seller: string;
    askPriceUsd: string;
  }) {
    this.logger.log(`Notifying listing created: ${data.listingId}`);
    
    this.gateway.emitToUser(data.seller, 'marketplace:listing_created', data);
    this.gateway.emitToMarketplace('marketplace:listing_created', data);
  }

  /**
   * Notify about listing sale
   */
  notifyListingSold(data: {
    listingId: number;
    wexelId: number;
    seller: string;
    buyer: string;
    priceUsd: string;
  }) {
    this.logger.log(`Notifying listing sold: ${data.listingId}`);
    
    this.gateway.emitToUser(data.seller, 'marketplace:listing_sold', data);
    this.gateway.emitToUser(data.buyer, 'marketplace:listing_sold', data);
    this.gateway.emitToMarketplace('marketplace:listing_sold', {
      listingId: data.listingId,
      wexelId: data.wexelId,
      priceUsd: data.priceUsd,
    });
  }

  /**
   * Notify about listing cancellation
   */
  notifyListingCancelled(data: {
    listingId: number;
    wexelId: number;
    seller: string;
  }) {
    this.logger.log(`Notifying listing cancelled: ${data.listingId}`);
    
    this.gateway.emitToUser(data.seller, 'marketplace:listing_cancelled', data);
    this.gateway.emitToMarketplace('marketplace:listing_cancelled', {
      listingId: data.listingId,
      wexelId: data.wexelId,
    });
  }

  /**
   * Get gateway stats
   */
  getStats() {
    return this.gateway.getStats();
  }
}
