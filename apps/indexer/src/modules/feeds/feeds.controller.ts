import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Controller('api/v1/feeds')
export class FeedsController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/v1/feeds/wexel/:id
   * Get event feed for a specific wexel
   */
  @Get('wexel/:id')
  async getWexelFeed(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 50;

      // Get blockchain events related to this wexel
      const events = await this.prisma.blockchainEvent.findMany({
        where: {
          OR: [
            {
              data: {
                path: ['id'],
                equals: id,
              },
            },
            {
              data: {
                path: ['wexel_id'],
                equals: id,
              },
            },
          ],
          processed: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limitNum,
      });

      // Get claims
      const claims = await this.prisma.claim.findMany({
        where: {
          wexel_id: BigInt(id),
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limitNum,
      });

      // Get boosts
      const boosts = await this.prisma.boost.findMany({
        where: {
          wexel_id: BigInt(id),
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limitNum,
      });

      // Combine and sort all events
      const feed = [
        ...events.map((e) => ({
          type: 'blockchain_event',
          event_type: e.event_type,
          tx_hash: e.tx_hash,
          data: e.data,
          timestamp: e.created_at,
        })),
        ...claims.map((c) => ({
          type: 'claim',
          amount_usd: c.amount_usd.toString(),
          claim_type: c.claim_type,
          tx_hash: c.tx_hash,
          timestamp: c.created_at,
        })),
        ...boosts.map((b) => ({
          type: 'boost',
          token_mint: b.token_mint,
          value_usd: b.value_usd.toString(),
          apy_boost_bp: b.apy_boost_bp,
          timestamp: b.created_at,
        })),
      ].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      return {
        success: true,
        data: feed.slice(0, limitNum),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get wexel feed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/v1/feeds/global
   * Get global activity feed
   */
  @Get('global')
  async getGlobalFeed(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 100;

      const events = await this.prisma.blockchainEvent.findMany({
        where: {
          processed: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limitNum,
      });

      return {
        success: true,
        data: events.map((e) => ({
          type: e.event_type,
          tx_hash: e.tx_hash,
          chain: e.chain,
          data: e.data,
          timestamp: e.created_at,
        })),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get global feed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
