import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OraclesService {
  constructor(private prisma: PrismaService) {}

  async getPrice(tokenMint: string, source?: string) {
    const price = await this.prisma.tokenPrice.findFirst({
      where: {
        token_mint: tokenMint,
        ...(source && { source }),
      },
      orderBy: { updated_at: 'desc' },
    });

    if (!price) {
      throw new NotFoundException(`Price for token ${tokenMint} not found`);
    }

    return {
      tokenMint: price.token_mint,
      priceUsd: price.price_usd,
      source: price.source,
      updatedAt: price.updated_at,
    };
  }

  async updatePrice(tokenMint: string, priceUsd: number, source: string) {
    return this.prisma.tokenPrice.upsert({
      where: {
        token_mint_source: {
          token_mint: tokenMint,
          source,
        },
      },
      update: {
        price_usd: priceUsd,
        updated_at: new Date(),
      },
      create: {
        token_mint: tokenMint,
        price_usd: priceUsd,
        source,
      },
    });
  }

  async getAllPrices() {
    return this.prisma.tokenPrice.findMany({
      orderBy: { updated_at: 'desc' },
    });
  }

  async calculateBoostApy(
    baseApy: number,
    boostAmount: number,
    targetAmount: number,
  ): Promise<number> {
    if (targetAmount === 0) return baseApy;

    const boostRatio = Math.min(boostAmount / targetAmount, 1);
    const maxBoost = 0.1; // 10% max boost
    const boostApy = baseApy * (1 + boostRatio * maxBoost);

    return Math.round(boostApy * 100) / 100; // Round to 2 decimal places
  }
}
