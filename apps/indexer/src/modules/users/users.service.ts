import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByAddress(address: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ solana_address: address }, { tron_address: address }],
      },
    });
  }

  async findOne(id: bigint) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    solana_address?: string;
    tron_address?: string;
    email?: string;
    telegram_id?: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(
    id: bigint,
    data: {
      email?: string;
      telegram_id?: string;
      is_kyc_verified?: boolean;
      is_active?: boolean;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async linkWallet(id: bigint, walletType: 'solana' | 'tron', address: string) {
    const updateData =
      walletType === 'solana'
        ? { solana_address: address }
        : { tron_address: address };

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async getStats(id: bigint) {
    const [wexels, totalDeposits, totalClaims] = await Promise.all([
      this.prisma.wexel.count({
        where: {
          OR: [{ owner_solana: { not: null } }, { owner_tron: { not: null } }],
        },
      }),
      this.prisma.wexel.aggregate({
        where: {
          OR: [{ owner_solana: { not: null } }, { owner_tron: { not: null } }],
        },
        _sum: { principal_usd: true },
      }),
      this.prisma.claim.aggregate({
        where: {
          wexel: {
            OR: [
              { owner_solana: { not: null } },
              { owner_tron: { not: null } },
            ],
          },
        },
        _sum: { amount_usd: true },
      }),
    ]);

    return {
      totalWexels: wexels,
      totalDeposits: totalDeposits._sum.principal_usd || BigInt(0),
      totalClaims: totalClaims._sum.amount_usd || BigInt(0),
    };
  }
}
