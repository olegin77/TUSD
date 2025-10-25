import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PoolsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pool.findMany({
      where: { is_active: true },
      orderBy: { apy_base_bp: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.pool.findUnique({
      where: { id },
    });
  }

  async create(data: {
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: bigint;
    boost_target_bp?: number;
    boost_max_bp?: number;
  }) {
    return this.prisma.pool.create({
      data: {
        apy_base_bp: data.apy_base_bp,
        lock_months: data.lock_months,
        min_deposit_usd: data.min_deposit_usd,
        boost_target_bp: data.boost_target_bp || 3000,
        boost_max_bp: data.boost_max_bp || 500,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      apy_base_bp: number;
      lock_months: number;
      min_deposit_usd: bigint;
      boost_target_bp: number;
      boost_max_bp: number;
      is_active: boolean;
    }>,
  ) {
    return this.prisma.pool.update({
      where: { id },
      data,
    });
  }

  async getStats() {
    const [totalPools, totalLiquidity, totalWexels] = await Promise.all([
      this.prisma.pool.count({ where: { is_active: true } }),
      this.prisma.pool.aggregate({
        where: { is_active: true },
        _sum: { total_liquidity: true },
      }),
      this.prisma.pool.aggregate({
        where: { is_active: true },
        _sum: { total_wexels: true },
      }),
    ]);

    return {
      totalPools,
      totalLiquidity: totalLiquidity._sum.total_liquidity || BigInt(0),
      totalWexels: totalWexels._sum.total_wexels || BigInt(0),
    };
  }
}
