import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { BuyListingDto } from './dto/buy-listing.dto';
import { MarketplaceFilterDto } from './dto/marketplace-filter.dto';

@Controller('api/v1/market')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  /**
   * GET /api/v1/market/listings
   * Get all active listings with optional filters
   */
  @Get('listings')
  async getListings(@Query() filters: MarketplaceFilterDto) {
    try {
      const listings = await this.marketplaceService.findAll(filters);
      return {
        success: true,
        data: listings,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch listings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/v1/market/listings/:id
   * Get specific listing details
   */
  @Get('listings/:id')
  async getListing(@Param('id', ParseIntPipe) id: number) {
    try {
      const listing = await this.marketplaceService.findOne(id);
      if (!listing) {
        throw new HttpException('Listing not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: listing,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to fetch listing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/v1/market/listings
   * Create new listing (sell wexel)
   */
  @Post('listings')
  async createListing(@Body() createListingDto: CreateListingDto) {
    try {
      const listing = await this.marketplaceService.create(createListingDto);
      return {
        success: true,
        data: listing,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /api/v1/market/buy
   * Purchase a listing
   */
  @Post('buy')
  async buyListing(@Body() buyListingDto: BuyListingDto) {
    try {
      const result = await this.marketplaceService.buy(buyListingDto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to purchase listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /api/v1/market/listings/:id/cancel
   * Cancel a listing
   */
  @Post('listings/:id/cancel')
  async cancelListing(
    @Param('id', ParseIntPipe) id: number,
    @Body('userAddress') userAddress: string,
  ) {
    try {
      const result = await this.marketplaceService.cancel(id, userAddress);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to cancel listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
