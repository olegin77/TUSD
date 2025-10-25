import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OraclesService {
  constructor(private prisma: PrismaService) {}

  async getPrice(tokenMint: string) {
    const price = await this.prisma.tokenPrice.findUnique({
      where: { token_mint: tokenMint },
    });

    if (!price) {
      throw new Error(`Price not found for token: ${tokenMint}`);
    }

    return {
      tokenMint: price.token_mint,
      priceUsd: price.price_usd,
      source: price.source,
      updatedAt: price.updated_at,
    };
  }

  async updatePrice(tokenMint: string, priceUsd: bigint, source: string) {
    return this.prisma.tokenPrice.upsert({
      where: { token_mint: tokenMint },
      update: {
        price_usd: priceUsd,
        source: source,
        updated_at: new Date(),
      },
      create: {
        token_mint: tokenMint,
        price_usd: priceUsd,
        source: source,
      },
    });
  }

  async getAllPrices() {
    return this.prisma.tokenPrice.findMany({
      orderBy: { updated_at: 'desc' },
    });
  }

  async calculateBoostValue(tokenMint: string, amount: bigint) {
    const price = await this.getPrice(tokenMint);
    return (amount * price.priceUsd) / BigInt(1000000); // Assuming 6 decimals
  }

  async calculateBoostApy(principalUsd: bigint, boostValueUsd: bigint) {
    const boostTarget = (principalUsd * BigInt(3000)) / BigInt(10000); // 30% of principal
    const boostRatio = (boostValueUsd * BigInt(10000)) / boostTarget;
    const maxBoostBp = BigInt(500); // 5% max boost

    if (boostRatio > BigInt(10000)) {
      return Number(maxBoostBp);
    }

    return Number((boostRatio * maxBoostBp) / BigInt(10000));
  }
}
