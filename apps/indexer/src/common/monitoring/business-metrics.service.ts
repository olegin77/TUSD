import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { MetricsService } from './metrics.service';

/**
 * BusinessMetricsService periodically updates business metrics
 * Runs every 5 minutes to keep metrics up-to-date
 */
@Injectable()
export class BusinessMetricsService {
  private readonly logger = new Logger(BusinessMetricsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  /**
   * Update all business metrics
   * Scheduled to run every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateBusinessMetrics(): Promise<void> {
    try {
      this.logger.debug('Updating business metrics...');

      await Promise.all([
        this.updateTVL(),
        this.updateWexelsCount(),
        this.updateUsersCount(),
        this.updateCollateralMetrics(),
      ]);

      this.logger.debug('Business metrics updated successfully');
    } catch (error) {
      this.logger.error('Failed to update business metrics', error);
    }
  }

  /**
   * Calculate and update Total Value Locked (TVL)
   */
  private async updateTVL(): Promise<void> {
    const result = await this.prisma.wexels.aggregate({
      _sum: {
        principal_usd: true,
      },
      where: {
        end_ts: {
          gte: new Date(), // Only count active wexels
        },
      },
    });

    const tvl = Number(result._sum.principal_usd || 0) / 1e6; // Convert from micro-units
    this.metrics.setTotalValueLocked(tvl);
  }

  /**
   * Update active wexels count
   */
  private async updateWexelsCount(): Promise<void> {
    const count = await this.prisma.wexels.count({
      where: {
        end_ts: {
          gte: new Date(),
        },
      },
    });

    this.metrics.setActiveWexelsCount(count);
  }

  /**
   * Update total users count
   */
  private async updateUsersCount(): Promise<void> {
    const count = await this.prisma.users.count();
    this.metrics.setTotalUsersCount(count);
  }

  /**
   * Update collateral-related metrics
   */
  private async updateCollateralMetrics(): Promise<void> {
    // Count collateralized wexels
    const collateralizedCount = await this.prisma.collateralPosition.count({
      where: {
        repaid: false,
      },
    });
    this.metrics.setCollateralizedWexelsCount(collateralizedCount);

    // Calculate total outstanding loans
    const result = await this.prisma.collateralPosition.aggregate({
      _sum: {
        loan_usd: true,
      },
      where: {
        repaid: false,
      },
    });

    const totalLoans = Number(result._sum.loan_usd || 0) / 1e6; // Convert from micro-units
    this.metrics.setTotalLoansOutstanding(totalLoans);
  }

  /**
   * Manual trigger for metrics update (useful for testing)
   */
  async triggerUpdate(): Promise<void> {
    await this.updateBusinessMetrics();
  }
}
