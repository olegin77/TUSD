import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ConfirmDepositDto } from './dto/confirm-deposit.dto';
import { ApplyBoostToDepositDto } from './dto/apply-boost-to-deposit.dto';

@Injectable()
export class DepositsService {
  private readonly logger = new Logger(DepositsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new deposit (reserve ID and initial data)
   */
  async create(createDepositDto: CreateDepositDto) {
    this.logger.log(
      `Creating deposit for user: ${createDepositDto.userAddress}`,
    );

    const deposit = await this.prisma.deposit.create({
      data: {
        pool_id: createDepositDto.poolId,
        user_address: createDepositDto.userAddress,
        amount_usd: BigInt(createDepositDto.amountUsd),
        status: 'pending',
      },
      include: {
        pool: true,
      },
    });

    return deposit;
  }

  /**
   * Confirm deposit after on-chain transaction
   */
  async confirm(id: number, confirmDepositDto: ConfirmDepositDto) {
    this.logger.log(
      `Confirming deposit ${id} with tx: ${confirmDepositDto.txHash}`,
    );

    // Verify transaction exists on-chain (TODO: implement on-chain verification)

    const deposit = await this.prisma.deposit.update({
      where: { id: BigInt(id) },
      data: {
        tx_hash: confirmDepositDto.txHash,
        wexel_id: confirmDepositDto.wexelId
          ? BigInt(confirmDepositDto.wexelId)
          : null,
        status: 'confirmed',
        updated_at: new Date(),
      },
      include: {
        pool: true,
      },
    });

    return deposit;
  }

  /**
   * Apply boost to a deposit
   */
  async applyBoost(id: number, applyBoostDto: ApplyBoostToDepositDto) {
    this.logger.log(`Applying boost to deposit ${id}`);

    const deposit = await this.prisma.deposit.findUnique({
      where: { id: BigInt(id) },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    if (!deposit.wexel_id) {
      throw new Error('Deposit must be confirmed before applying boost');
    }

    // Create boost record
    const boost = await this.prisma.boost.create({
      data: {
        wexel_id: deposit.wexel_id,
        token_mint: applyBoostDto.tokenMint,
        amount: BigInt(applyBoostDto.amount),
        value_usd: BigInt(applyBoostDto.valueUsd),
        apy_boost_bp: applyBoostDto.apyBoostBp,
        price_usd: BigInt(applyBoostDto.priceUsd),
      },
    });

    // Update wexel with new boost
    await this.prisma.wexel.update({
      where: { id: deposit.wexel_id },
      data: {
        apy_boost_bp: applyBoostDto.apyBoostBp,
        updated_at: new Date(),
      },
    });

    return {
      deposit,
      boost,
    };
  }

  /**
   * Find all deposits, optionally filtered by user address
   */
  async findAll(userAddress?: string) {
    const where = userAddress ? { user_address: userAddress } : {};

    return this.prisma.deposit.findMany({
      where,
      include: {
        pool: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Find one deposit by ID
   */
  async findOne(id: number) {
    return this.prisma.deposit.findUnique({
      where: { id: BigInt(id) },
      include: {
        pool: true,
      },
    });
  }
}
