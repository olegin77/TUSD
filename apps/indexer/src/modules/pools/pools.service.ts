import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';

@Injectable()
export class PoolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    return this.prisma.pool.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string): Promise<any> {
    const pool = await this.prisma.pool.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with ID ${id} not found`);
    }

    return pool;
  }

  async create(createPoolDto: CreatePoolDto): Promise<any> {
    return this.prisma.pool.create({
      data: {
        apy_base_bp: createPoolDto.apy_base_bp,
        lock_months: createPoolDto.lock_months,
        min_deposit_usd: createPoolDto.min_deposit_usd,
        boost_target_bp: createPoolDto.boost_target_bp,
        boost_max_bp: createPoolDto.boost_max_bp,
        is_active: createPoolDto.is_active,
      },
    });
  }

  async update(id: string, updatePoolDto: UpdatePoolDto): Promise<any> {
    const pool = await this.findOne(id);

    return this.prisma.pool.update({
      where: { id: parseInt(id) },
      data: {
        ...(updatePoolDto.apy_base_bp !== undefined && {
          apy_base_bp: updatePoolDto.apy_base_bp,
        }),
        ...(updatePoolDto.lock_months !== undefined && {
          lock_months: updatePoolDto.lock_months,
        }),
        ...(updatePoolDto.min_deposit_usd !== undefined && {
          min_deposit_usd: updatePoolDto.min_deposit_usd,
        }),
        ...(updatePoolDto.boost_target_bp !== undefined && {
          boost_target_bp: updatePoolDto.boost_target_bp,
        }),
        ...(updatePoolDto.boost_max_bp !== undefined && {
          boost_max_bp: updatePoolDto.boost_max_bp,
        }),
        ...(updatePoolDto.is_active !== undefined && {
          is_active: updatePoolDto.is_active,
        }),
      },
    });
  }

  async remove(id: string): Promise<any> {
    await this.findOne(id);
    return this.prisma.pool.delete({
      where: { id: parseInt(id) },
    });
  }
}
