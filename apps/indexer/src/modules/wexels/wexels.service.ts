import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWexelDto } from './dto/create-wexel.dto';
import { ApplyBoostDto } from './dto/apply-boost.dto';

@Injectable()
export class WexelsService {
  constructor(private prisma: PrismaService) {}

  async create(createWexelDto: CreateWexelDto) {
    return this.prisma.wexel.create({
      data: createWexelDto,
    });
  }

  async findAll() {
    return this.prisma.wexel.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(id) },
    });

    if (!wexel) {
      throw new NotFoundException(`Wexel with ID ${id} not found`);
    }

    return wexel;
  }

  async applyBoost(applyBoostDto: ApplyBoostDto) {
    const wexel = await this.findOne(applyBoostDto.wexel_id.toString());

    return this.prisma.boost.create({
      data: {
        wexel_id: applyBoostDto.wexel_id,
        token_mint: applyBoostDto.token_mint,
        amount: applyBoostDto.amount,
        value_usd: BigInt(Math.floor(applyBoostDto.valueUsd * 1_000_000)), // Convert to micro-units
        apy_boost_bp: applyBoostDto.apyBoostBp,
        price_usd: BigInt(Math.floor(applyBoostDto.priceUsd * 1_000_000)), // Convert to micro-units
      },
    });
  }

  async update(id: string, updateWexelDto: Partial<CreateWexelDto>) {
    await this.findOne(id);

    return this.prisma.wexel.update({
      where: { id: BigInt(id) },
      data: updateWexelDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.wexel.delete({
      where: { id: BigInt(id) },
    });
  }

  /**
   * Calculate rewards for a wexel
   * Formula: Reward_day = Principal × (APY_eff / 100) × (1 / 365)
   * If collateralized: User gets 40%, Platform gets 60%
   */
  async calculateRewards(id: number) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(id) },
      include: {
        pool: true,
        collateral_position: true,
        claims: true,
      },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    const now = new Date();
    const startTime = wexel.start_ts.getTime();
    const currentTime = now.getTime();
    const daysElapsed = Math.floor((currentTime - startTime) / (1000 * 86400));

    // Calculate effective APY
    const apyBaseBp = wexel.apy_base_bp;
    const apyBoostBp = wexel.apy_boost_bp;
    const apyEffBp = apyBaseBp + apyBoostBp;

    // Daily reward = Principal * (APY_eff / 10000) / 365
    const principalUsd = Number(wexel.principal_usd);
    const dailyReward = (principalUsd * apyEffBp) / (10000 * 365);
    const totalAccruedRewards = dailyReward * daysElapsed;

    // Calculate user share (40% if collateralized, 100% otherwise)
    const isCollateralized = wexel.is_collateralized;
    const userShare = isCollateralized ? 0.4 : 1.0;
    const platformShare = isCollateralized ? 0.6 : 0.0;

    const userAccruedRewards = totalAccruedRewards * userShare;
    const platformAccruedRewards = totalAccruedRewards * platformShare;

    // Calculate claimed amount
    const totalClaimed = Number(wexel.total_claimed_usd);
    const unclaimedRewards = userAccruedRewards - totalClaimed;

    return {
      wexel_id: id,
      principal_usd: principalUsd,
      apy_base_bp: apyBaseBp,
      apy_boost_bp: apyBoostBp,
      apy_effective_bp: apyEffBp,
      apy_effective_percent: apyEffBp / 100,
      days_elapsed: daysElapsed,
      daily_reward: Math.floor(dailyReward * 1_000_000), // Convert to micro-units
      total_accrued_rewards: Math.floor(totalAccruedRewards * 1_000_000),
      user_accrued_rewards: Math.floor(userAccruedRewards * 1_000_000),
      platform_accrued_rewards: Math.floor(platformAccruedRewards * 1_000_000),
      total_claimed: totalClaimed,
      unclaimed_rewards: Math.floor(unclaimedRewards * 1_000_000),
      is_collateralized: isCollateralized,
      user_share: userShare,
      platform_share: platformShare,
      end_date: wexel.end_ts,
    };
  }

  /**
   * Claim rewards for a wexel
   */
  async claimRewards(id: number, txHash: string) {
    const rewards = await this.calculateRewards(id);

    if (rewards.unclaimed_rewards <= 0) {
      throw new Error('No rewards to claim');
    }

    // Create claim record
    const claim = await this.prisma.claim.create({
      data: {
        wexel_id: BigInt(id),
        amount_usd: BigInt(rewards.unclaimed_rewards),
        claim_type: 'partial',
        tx_hash: txHash,
      },
    });

    // Update wexel total claimed
    const wexel = await this.prisma.wexel.update({
      where: { id: BigInt(id) },
      data: {
        total_claimed_usd:
          BigInt(rewards.total_claimed) + BigInt(rewards.unclaimed_rewards),
        updated_at: new Date(),
      },
    });

    return {
      claim,
      wexel,
      claimed_amount: rewards.unclaimed_rewards,
    };
  }
}
