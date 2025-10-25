import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WexelsService {
  constructor(private prisma: PrismaService) {}

  async findByOwner(ownerAddress: string) {
    return this.prisma.wexel.findMany({
      where: {
        OR: [{ owner_solana: ownerAddress }, { owner_tron: ownerAddress }],
      },
      include: {
        pool: true,
        collateral_position: true,
        listings: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: bigint) {
    return this.prisma.wexel.findUnique({
      where: { id },
      include: {
        pool: true,
        collateral_position: true,
        listings: true,
        claims: {
          orderBy: { created_at: 'desc' },
        },
        boosts: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async create(data: {
    owner_solana?: string;
    owner_tron?: string;
    pool_id: number;
    principal_usd: bigint;
    apy_base_bp: number;
    start_ts: Date;
    end_ts: Date;
    nft_mint_address?: string;
    nft_token_address?: string;
  }) {
    return this.prisma.wexel.create({
      data,
      include: {
        pool: true,
      },
    });
  }

  async calculateRewards(wexelId: bigint) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: wexelId },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    const now = new Date();
    const startTime = wexel.start_ts;
    const endTime = wexel.end_ts;

    // Calculate days since start
    const daysElapsed = Math.floor(
      (now.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalDays = Math.floor(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate daily reward
    const totalApyBp = wexel.apy_base_bp + wexel.apy_boost_bp;
    const dailyReward =
      (wexel.principal_usd * BigInt(totalApyBp)) / BigInt(365 * 10000);

    // Calculate total rewards
    const totalRewards = dailyReward * BigInt(daysElapsed);
    const claimedRewards = wexel.total_claimed_usd;
    const pendingRewards = totalRewards - claimedRewards;

    return {
      wexelId,
      principal: wexel.principal_usd,
      apyBase: wexel.apy_base_bp,
      apyBoost: wexel.apy_boost_bp,
      totalApy: totalApyBp,
      dailyReward,
      daysElapsed,
      totalDays,
      totalRewards,
      claimedRewards,
      pendingRewards,
      isMatured: now >= endTime,
    };
  }

  async claimRewards(wexelId: bigint, amount: bigint, txHash?: string) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: wexelId },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    // Create claim record
    const claim = await this.prisma.claim.create({
      data: {
        wexel_id: wexelId,
        amount_usd: amount,
        claim_type: 'daily',
        tx_hash: txHash,
      },
    });

    // Update wexel total claimed
    await this.prisma.wexel.update({
      where: { id: wexelId },
      data: {
        total_claimed_usd: wexel.total_claimed_usd + amount,
      },
    });

    return claim;
  }

  async collateralize(wexelId: bigint) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: wexelId },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    if (wexel.is_collateralized) {
      throw new Error('Wexel already collateralized');
    }

    const loanAmount = (wexel.principal_usd * BigInt(6000)) / BigInt(10000); // 60% LTV

    // Create collateral position
    const collateralPosition = await this.prisma.collateralPosition.create({
      data: {
        wexel_id: wexelId,
        loan_usd: loanAmount,
        start_ts: new Date(),
      },
    });

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: wexelId },
      data: {
        is_collateralized: true,
      },
    });

    return collateralPosition;
  }

  async repayLoan(wexelId: bigint, amount: bigint) {
    const collateralPosition = await this.prisma.collateralPosition.findUnique({
      where: { wexel_id: wexelId },
    });

    if (!collateralPosition) {
      throw new Error('Collateral position not found');
    }

    if (collateralPosition.repaid) {
      throw new Error('Loan already repaid');
    }

    // Update collateral position
    await this.prisma.collateralPosition.update({
      where: { wexel_id: wexelId },
      data: {
        repaid: true,
      },
    });

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: wexelId },
      data: {
        is_collateralized: false,
      },
    });

    return { success: true, repaidAmount: amount };
  }
}
