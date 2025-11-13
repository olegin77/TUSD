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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { BuyListingDto } from './dto/buy-listing.dto';
import { MarketplaceFilterDto } from './dto/marketplace-filter.dto';

@ApiTags('marketplace')
@Controller('api/v1/market')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  /**
   * GET /api/v1/market/listings
   * Get all active listings with optional filters
   */
  @Get('listings')
  @ApiOperation({
    summary: 'Get marketplace listings',
    description: 'Retrieve all active wexel listings with optional filters',
  })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'poolId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Listings retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            wexel_id: 123,
            seller_address: '0xabc...',
            price_usd: '1500000000',
            status: 'ACTIVE',
            created_at: '2025-01-15T10:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({
    summary: 'Get listing by ID',
    description: 'Retrieve detailed information about a specific listing',
  })
  @ApiParam({ name: 'id', description: 'Listing ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Listing found',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          wexel_id: 123,
          seller_address: '0xabc...',
          price_usd: '1500000000',
          status: 'ACTIVE',
          created_at: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiOperation({
    summary: 'Create new listing',
    description: 'List a wexel for sale on the marketplace',
  })
  @ApiBody({ type: CreateListingDto })
  @ApiResponse({
    status: 201,
    description: 'Listing created successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          wexel_id: 123,
          seller_address: '0xabc...',
          price_usd: '1500000000',
          status: 'ACTIVE',
          created_at: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
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
  @ApiOperation({
    summary: 'Purchase listing',
    description: 'Buy a wexel from the marketplace',
  })
  @ApiBody({ type: BuyListingDto })
  @ApiResponse({
    status: 200,
    description: 'Purchase successful',
    schema: {
      example: {
        success: true,
        data: {
          listing_id: 1,
          buyer_address: '0xdef...',
          price_paid: '1500000000',
          tx_hash: '0x789...',
          purchased_at: '2025-01-15T10:10:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Insufficient funds or listing unavailable',
  })
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
  @ApiOperation({
    summary: 'Cancel listing',
    description: 'Cancel an active listing and remove it from the marketplace',
  })
  @ApiParam({ name: 'id', description: 'Listing ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userAddress: {
          type: 'string',
          description: 'Address of the listing owner',
        },
      },
      required: ['userAddress'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Listing cancelled successfully',
    schema: {
      example: {
        success: true,
        data: {
          listing_id: 1,
          status: 'CANCELLED',
          cancelled_at: '2025-01-15T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Not listing owner' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
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
