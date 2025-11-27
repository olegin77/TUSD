import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * PoolsService - now uses Vault model
 * Provides vault (previously pool) functionality
 */
@Injectable()
export class PoolsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Serialize vault for JSON response (convert BigInt/Decimal to string/number)
   * Includes APY basis points for precision calculations
   */
  private serializeVault(vault: any): any {
    return {
      ...vault,
      // BigInt fields
      min_deposit_usd: vault.min_deposit_usd?.toString() ?? '0',
      total_liquidity: vault.total_liquidity?.toString() ?? '0',
      total_wexels: vault.total_wexels?.toString() ?? '0',
      // Decimal fields
      min_entry_amount: Number(vault.min_entry_amount ?? 0),
      current_liquidity: Number(vault.current_liquidity ?? 0),
      target_liquidity: Number(vault.target_liquidity ?? 0),
      mining_allocation: Number(vault.mining_allocation ?? 0),
      boost_fixed_price: vault.boost_fixed_price
        ? Number(vault.boost_fixed_price)
        : null,
      // APY in basis points (Master v6)
      base_apy_bps: vault.base_apy_bps ?? 0,
      boost_apy_bps: vault.boost_apy_bps ?? 0,
      max_apy_bps: vault.max_apy_bps ?? 0,
      takara_apr_bps: vault.takara_apr_bps ?? 0,
    };
  }

  async findAll(): Promise<any[]> {
    const vaults = await this.prisma.vault.findMany({
      orderBy: { id: 'asc' },
    });
    return vaults.map((v) => this.serializeVault(v));
  }

  async findOne(id: string): Promise<any> {
    const vault = await this.prisma.vault.findUnique({
      where: { id: parseInt(id) },
    });

    if (!vault) {
      throw new NotFoundException(`Vault with ID ${id} not found`);
    }

    return this.serializeVault(vault);
  }

  async findActive(): Promise<any[]> {
    const vaults = await this.prisma.vault.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    });
    return vaults.map((v) => this.serializeVault(v));
  }

  /**
   * Get vault yields summary (Master v6 - correct APY values)
   * Frequency multipliers: Monthly x1.0, Quarterly x1.15, Yearly x1.30
   */
  async getYieldSummary(): Promise<any[]> {
    const vaults = await this.prisma.vault.findMany({
      where: { is_active: true },
    });

    return vaults.map((vault) => {
      // Use basis points for precision
      const baseApyBps =
        vault.base_apy_bps || Math.round(vault.base_usdt_apy * 100);
      const boostApyBps =
        vault.boost_apy_bps ||
        Math.round((vault.boosted_usdt_apy - vault.base_usdt_apy) * 100);
      const maxApyBps = vault.max_apy_bps || baseApyBps + boostApyBps;

      // Calculate frequency multiplied APYs (Master v6 spec)
      const maxApyPercent = maxApyBps / 100;
      const maxApyMonthly = maxApyPercent; // x1.0
      const maxApyQuarterly = maxApyPercent * 1.15; // x1.15
      const maxApyYearly = maxApyPercent * 1.3; // x1.30

      return {
        vaultId: vault.id,
        name: vault.name,
        type: vault.type,
        minEntryAmount: Number(vault.min_entry_amount),
        durationMonths: vault.duration_months,
        boostToken: vault.boost_token_symbol,
        boostRatio: vault.boost_ratio,
        boostDiscount: vault.boost_discount,
        boostFixedPrice: vault.boost_fixed_price
          ? Number(vault.boost_fixed_price)
          : null,
        usdtYield: {
          baseApy: vault.base_usdt_apy,
          boostApy: vault.boosted_usdt_apy - vault.base_usdt_apy,
          maxApy: vault.boosted_usdt_apy,
          // Basis points for precision
          baseApyBps,
          boostApyBps,
          maxApyBps,
          // With frequency multipliers
          maxApyMonthly: Math.round(maxApyMonthly * 100) / 100,
          maxApyQuarterly: Math.round(maxApyQuarterly * 100) / 100,
          maxApyYearly: Math.round(maxApyYearly * 100) / 100,
        },
        takaraYield: {
          apr: vault.takara_apr,
          aprBps: vault.takara_apr_bps || Math.round(vault.takara_apr * 100),
          miningAllocation: Number(vault.mining_allocation),
        },
        batchInfo: {
          currentBatch: vault.batch_number,
          status: vault.batch_status,
          currentLiquidity: Number(vault.current_liquidity),
          targetLiquidity: Number(vault.target_liquidity),
        },
      };
    });
  }

  /**
   * Calculate effective APY with frequency multiplier
   * @param baseApyBps Base APY in basis points
   * @param boostApyBps Boost APY in basis points
   * @param frequency Payout frequency
   * @returns Effective APY in percent
   */
  calculateEffectiveApy(
    baseApyBps: number,
    boostApyBps: number,
    frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
  ): number {
    const totalBps = baseApyBps + boostApyBps;
    const multipliers = {
      MONTHLY: 1.0,
      QUARTERLY: 1.15,
      YEARLY: 1.3,
    };
    return (totalBps / 100) * multipliers[frequency];
  }
}
