import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Get total value locked
      const wexelsAgg = await this.prisma.wexel.aggregate({
        _sum: {
          principal_usd: true,
        },
        _count: true,
      });

      // Get active wexels count
      const activeWexels = await this.prisma.wexel.count({
        where: {
          end_ts: {
            gt: new Date(),
          },
        },
      });

      // Get collateralized wexels count
      const collateralizedWexels = await this.prisma.wexel.count({
        where: {
          is_collateralized: true,
        },
      });

      // Get total users count
      const totalUsers = await this.prisma.user.count();

      // Get total rewards paid (sum of total_claimed_usd)
      const rewardsAgg = await this.prisma.wexel.aggregate({
        _sum: {
          total_claimed_usd: true,
        },
      });

      // Calculate average APY across all pools
      const pools = await this.prisma.pool.findMany();
      const avgAPY =
        pools.length > 0
          ? pools.reduce((sum, p) => sum + p.apy_base_bp, 0) /
            pools.length /
            100
          : 0;

      return {
        totalValueLocked: `$${((wexelsAgg._sum.principal_usd || 0) / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        totalUsers,
        totalWexels: wexelsAgg._count,
        activeWexels,
        collateralizedWexels,
        totalRewardsPaid: `$${((rewardsAgg._sum.total_claimed_usd || 0) / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        averageAPY: Number(avgAPY.toFixed(1)),
        systemHealth: 'healthy' as const,
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard stats', error);
      throw error;
    }
  }

  /**
   * Get all users with stats
   */
  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();

      // Fetch wexel stats for each user separately
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const wexels = await this.prisma.wexel.findMany({
            where: {
              OR: [
                { owner_solana: user.solana_address },
                { owner_tron: user.tron_address },
              ],
            },
            select: {
              principal_usd: true,
            },
          });

          return {
            id: user.id,
            solana_address: user.solana_address,
            tron_address: user.tron_address,
            created_at: user.created_at,
            total_deposited: wexels.reduce(
              (sum, w) => sum + Number(w.principal_usd),
              0,
            ),
            total_wexels: wexels.length,
            kyc_status: 'approved', // TODO: Implement KYC status
          };
        }),
      );

      return usersWithStats;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  /**
   * Get all wexels with details
   */
  async getAllWexels(filters?: { status?: string }) {
    try {
      const where: any = {};

      if (filters?.status === 'active') {
        where.end_ts = { gt: new Date() };
      } else if (filters?.status === 'completed') {
        where.end_ts = { lte: new Date() };
      } else if (filters?.status === 'collateralized') {
        where.is_collateralized = true;
      }

      const wexels = await this.prisma.wexel.findMany({
        where,
        include: {
          pool: true,
        },
        orderBy: {
          id: 'desc',
        },
        take: 100,
      });

      return wexels.map((wexel) => ({
        id: Number(wexel.id),
        owner_address: wexel.owner_solana || wexel.owner_tron || 'unknown',
        pool_id: wexel.pool_id,
        principal_usd: Number(wexel.principal_usd),
        apy_base_bp: wexel.apy_base_bp,
        apy_boost_bp: wexel.apy_boost_bp,
        start_ts: wexel.start_ts,
        end_ts: wexel.end_ts,
        is_collateralized: wexel.is_collateralized,
        total_claimed_usd: Number(wexel.total_claimed_usd),
        status: wexel.end_ts > new Date() ? 'active' : 'completed',
      }));
    } catch (error) {
      this.logger.error('Error fetching wexels', error);
      throw error;
    }
  }

  /**
   * Get oracle data (mock for now)
   */
  async getOracleData() {
    // TODO: Integrate with actual oracle service
    return [
      {
        token: 'BOOST',
        aggregatedPrice: 0.0245,
        lastUpdate: Date.now(),
        maxDeviation: 150,
        sources: [
          {
            source: 'Pyth',
            price: 0.0246,
            timestamp: Date.now(),
            status: 'active',
            deviation: 0.4,
          },
          {
            source: 'Raydium TWAP',
            price: 0.0244,
            timestamp: Date.now(),
            status: 'active',
            deviation: -0.4,
          },
          {
            source: 'Binance',
            price: 0.0245,
            timestamp: Date.now(),
            status: 'active',
            deviation: 0,
          },
        ],
      },
    ];
  }

  /**
   * Get global settings
   */
  async getGlobalSettings() {
    // TODO: Store in database
    return {
      marketplace_fee_bp: 250,
      multisig_address:
        process.env.ADMIN_MULTISIG_ADDRESS ||
        '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      timelock_address:
        process.env.TIMELOCK_ADDRESS ||
        '9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      pause_guardian_address:
        process.env.PAUSE_GUARDIAN_ADDRESS ||
        '8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      system_paused: false,
      kyc_required: false,
      min_deposit_global: 100,
    };
  }

  /**
   * Update global settings
   */
  async updateGlobalSettings(settings: any) {
    // TODO: Store in database and validate with Multisig
    this.logger.log('Global settings update requested', settings);
    return this.getGlobalSettings();
  }

  /**
   * Update pool (admin only)
   */
  async updatePool(poolId: number, data: any) {
    try {
      const pool = await this.prisma.pool.update({
        where: { id: poolId },
        data: {
          apy_base_bp: data.apy_base_bp,
          lock_months: data.lock_months,
          boost_target_bp: data.boost_target_bp,
          boost_max_bp: data.boost_max_bp,
        },
      });
      return pool;
    } catch (error) {
      this.logger.error(`Error updating pool ${poolId}`, error);
      throw error;
    }
  }
}
