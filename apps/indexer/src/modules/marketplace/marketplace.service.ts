import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { BuyListingDto } from './dto/buy-listing.dto';
import { MarketplaceFilterDto } from './dto/marketplace-filter.dto';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Find all listings with optional filters
   */
  async findAll(filters: MarketplaceFilterDto) {
    const where: any = {
      status: 'active',
    };

    // Apply filters
    if (filters.minApy) {
      where.wexel = {
        ...where.wexel,
        apy_base_bp: { gte: parseInt(filters.minApy) },
      };
    }

    if (filters.maxPrice) {
      where.ask_price_usd = { lte: BigInt(filters.maxPrice) };
    }

    if (filters.isCollateralized !== undefined) {
      where.wexel = {
        ...where.wexel,
        is_collateralized: filters.isCollateralized === 'true',
      };
    }

    const listings = await this.prisma.listing.findMany({
      where,
      include: {
        wexel: {
          include: {
            pool: true,
            collateral_position: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return listings;
  }

  /**
   * Find one listing by ID
   */
  async findOne(id: number) {
    return this.prisma.listing.findUnique({
      where: { id: BigInt(id) },
      include: {
        wexel: {
          include: {
            pool: true,
            collateral_position: true,
            boosts: true,
          },
        },
      },
    });
  }

  /**
   * Create new listing
   */
  async create(createListingDto: CreateListingDto) {
    this.logger.log(`Creating listing for wexel ${createListingDto.wexelId}`);

    // Verify wexel exists and not already listed
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(createListingDto.wexelId) },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    // Check if wexel is collateralized (may restrict listing)
    if (wexel.is_collateralized) {
      this.logger.warn(`Attempting to list collateralized wexel ${createListingDto.wexelId}`);
      // According to TZ: listing impossible or special market with disclaimer
      throw new Error('Cannot list collateralized wexel');
    }

    // Check if already listed
    const existingListing = await this.prisma.listing.findFirst({
      where: {
        wexel_id: BigInt(createListingDto.wexelId),
        status: 'active',
      },
    });

    if (existingListing) {
      throw new Error('Wexel already has an active listing');
    }

    // Create listing
    const listing = await this.prisma.listing.create({
      data: {
        wexel_id: BigInt(createListingDto.wexelId),
        ask_price_usd: BigInt(createListingDto.askPriceUsd),
        auction: createListingDto.auction || false,
        min_bid_usd: createListingDto.minBidUsd ? BigInt(createListingDto.minBidUsd) : null,
        expiry_ts: createListingDto.expiryTs ? new Date(createListingDto.expiryTs) : null,
        status: 'active',
      },
      include: {
        wexel: {
          include: {
            pool: true,
          },
        },
      },
    });

    this.logger.log(`Listing created: ${listing.id}`);
    return listing;
  }

  /**
   * Buy a listing
   */
  async buy(buyListingDto: BuyListingDto) {
    this.logger.log(`Buying listing ${buyListingDto.listingId}`);

    // Get listing
    const listing = await this.prisma.listing.findUnique({
      where: { id: BigInt(buyListingDto.listingId) },
      include: { wexel: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.status !== 'active') {
      throw new Error('Listing is not active');
    }

    // Verify price matches
    if (BigInt(buyListingDto.price) < listing.ask_price_usd) {
      throw new Error('Price is less than asking price');
    }

    // Update listing
    await this.prisma.listing.update({
      where: { id: BigInt(buyListingDto.listingId) },
      data: {
        status: 'sold',
        updated_at: new Date(),
      },
    });

    // Transfer wexel ownership
    await this.prisma.wexel.update({
      where: { id: listing.wexel_id },
      data: {
        owner_solana: buyListingDto.buyerAddress.startsWith('T') ? null : buyListingDto.buyerAddress,
        owner_tron: buyListingDto.buyerAddress.startsWith('T') ? buyListingDto.buyerAddress : null,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Listing ${buyListingDto.listingId} sold to ${buyListingDto.buyerAddress}`);

    return {
      listing_id: buyListingDto.listingId,
      wexel_id: listing.wexel_id.toString(),
      buyer: buyListingDto.buyerAddress,
      price: buyListingDto.price,
      tx_hash: buyListingDto.txHash,
    };
  }

  /**
   * Cancel a listing
   */
  async cancel(listingId: number, userAddress: string) {
    this.logger.log(`Cancelling listing ${listingId}`);

    const listing = await this.prisma.listing.findUnique({
      where: { id: BigInt(listingId) },
      include: { wexel: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    // Verify ownership
    if (
      listing.wexel.owner_solana !== userAddress &&
      listing.wexel.owner_tron !== userAddress
    ) {
      throw new Error('Unauthorized: You are not the owner of this wexel');
    }

    if (listing.status !== 'active') {
      throw new Error('Listing is not active');
    }

    await this.prisma.listing.update({
      where: { id: BigInt(listingId) },
      data: {
        status: 'cancelled',
        updated_at: new Date(),
      },
    });

    this.logger.log(`Listing ${listingId} cancelled`);

    return {
      listing_id: listingId,
      status: 'cancelled',
    };
  }
}
