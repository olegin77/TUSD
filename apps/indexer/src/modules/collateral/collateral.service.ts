import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OpenCollateralDto } from './dto/open-collateral.dto';
import { RepayLoanDto } from './dto/repay-loan.dto';

const LTV_BP = 6000; // 60% LTV as per TZ

@Injectable()
export class CollateralService {
  private readonly logger = new Logger(CollateralService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Open collateral position
   * LTV = 60% (6000 basis points)
   */
  async open(wexelId: number, openCollateralDto: OpenCollateralDto) {
    this.logger.log(`Opening collateral for wexel ${wexelId}`);

    // Get wexel
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(wexelId) },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    if (wexel.is_collateralized) {
      throw new Error('Wexel is already collateralized');
    }

    // Calculate loan amount: Loan = 0.60 * Principal
    const loanUsd = (wexel.principal_usd * BigInt(LTV_BP)) / BigInt(10000);

    // Create collateral position
    const position = await this.prisma.collateralPosition.create({
      data: {
        wexel_id: BigInt(wexelId),
        loan_usd: loanUsd,
        start_ts: new Date(),
        repaid: false,
      },
    });

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: BigInt(wexelId) },
      data: {
        is_collateralized: true,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Collateral opened: wexel ${wexelId}, loan ${loanUsd}`);

    return {
      position,
      wexel: await this.prisma.wexel.findUnique({
        where: { id: BigInt(wexelId) },
      }),
    };
  }

  /**
   * Repay loan and release wexel
   */
  async repay(wexelId: number, repayLoanDto: RepayLoanDto) {
    this.logger.log(`Repaying loan for wexel ${wexelId}`);

    // Get collateral position
    const position = await this.prisma.collateralPosition.findUnique({
      where: { wexel_id: BigInt(wexelId) },
    });

    if (!position) {
      throw new Error('Collateral position not found');
    }

    if (position.repaid) {
      throw new Error('Loan already repaid');
    }

    // Verify repayment amount (should be >= loan amount)
    if (BigInt(repayLoanDto.repayAmount) < position.loan_usd) {
      throw new Error('Repayment amount is less than loan amount');
    }

    // Update collateral position
    await this.prisma.collateralPosition.update({
      where: { wexel_id: BigInt(wexelId) },
      data: {
        repaid: true,
        updated_at: new Date(),
      },
    });

    // Update wexel
    await this.prisma.wexel.update({
      where: { id: BigInt(wexelId) },
      data: {
        is_collateralized: false,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Loan repaid for wexel ${wexelId}`);

    return {
      wexel_id: wexelId,
      repaid: true,
      tx_hash: repayLoanDto.txHash,
    };
  }

  /**
   * Get collateral position
   */
  async getPosition(wexelId: number) {
    return this.prisma.collateralPosition.findUnique({
      where: { wexel_id: BigInt(wexelId) },
      include: {
        wexel: {
          include: {
            pool: true,
          },
        },
      },
    });
  }

  /**
   * Calculate potential loan amount
   */
  async calculateLoan(wexelId: number) {
    const wexel = await this.prisma.wexel.findUnique({
      where: { id: BigInt(wexelId) },
    });

    if (!wexel) {
      throw new Error('Wexel not found');
    }

    if (wexel.is_collateralized) {
      throw new Error('Wexel is already collateralized');
    }

    const loanUsd = (wexel.principal_usd * BigInt(LTV_BP)) / BigInt(10000);

    return {
      wexel_id: wexelId,
      principal_usd: wexel.principal_usd.toString(),
      loan_usd: loanUsd.toString(),
      ltv_bp: LTV_BP,
      ltv_percentage: LTV_BP / 100, // 60%
    };
  }
}
