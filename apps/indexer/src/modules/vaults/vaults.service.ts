import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVaultDto, VaultType } from './dto/create-vault.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { Decimal } from '@prisma/client/runtime/library';

// Frequency multipliers according to TZ
const FREQUENCY_MULTIPLIERS = {
  MONTHLY: 1.0,
  QUARTERLY: 1.15,
  YEARLY: 1.3,
};

// Internal Takara price for calculations
const TAKARA_INTERNAL_PRICE = 0.1; // $0.10

// Batch target liquidity
const BATCH_TARGET_LIQUIDITY = 100000; // $100,000

@Injectable()
export class VaultsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all vaults with their current batch info
   */
  async findAll(): Promise<any[]> {
    return this.prisma.vault.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { deposits: true, wexels: true },
        },
      },
    });
  }

  /**
   * Get vault by ID
   */
  async findOne(id: number): Promise<any> {
    const vault = await this.prisma.vault.findUnique({
      where: { id },
      include: {
        _count: {
          select: { deposits: true, wexels: true },
        },
      },
    });

    if (!vault) {
      throw new NotFoundException(`Vault with ID ${id} not found`);
    }

    return vault;
  }

  /**
   * Create new vault
   */
  async create(createVaultDto: CreateVaultDto): Promise<any> {
    return this.prisma.vault.create({
      data: {
        name: createVaultDto.name,
        type: createVaultDto.type,
        duration_months: createVaultDto.duration_months,
        min_entry_amount: new Decimal(createVaultDto.min_entry_amount),
        base_usdt_apy: createVaultDto.base_usdt_apy,
        boosted_usdt_apy: createVaultDto.boosted_usdt_apy,
        takara_apr: createVaultDto.takara_apr,
        boost_token_symbol: createVaultDto.boost_token_symbol,
        boost_ratio: createVaultDto.boost_ratio,
        boost_discount: createVaultDto.boost_discount ?? 0,
        boost_fixed_price: createVaultDto.boost_fixed_price
          ? new Decimal(createVaultDto.boost_fixed_price)
          : null,
        target_liquidity: new Decimal(
          createVaultDto.target_liquidity ?? BATCH_TARGET_LIQUIDITY,
        ),
        is_active: createVaultDto.is_active ?? true,
        // Legacy compatibility
        lock_months: createVaultDto.duration_months,
      },
    });
  }

  /**
   * Update vault
   */
  async update(id: number, updateVaultDto: UpdateVaultDto): Promise<any> {
    await this.findOne(id);

    const updateData: any = {};

    if (updateVaultDto.name !== undefined) updateData.name = updateVaultDto.name;
    if (updateVaultDto.type !== undefined) updateData.type = updateVaultDto.type;
    if (updateVaultDto.duration_months !== undefined) {
      updateData.duration_months = updateVaultDto.duration_months;
      updateData.lock_months = updateVaultDto.duration_months;
    }
    if (updateVaultDto.min_entry_amount !== undefined) {
      updateData.min_entry_amount = new Decimal(updateVaultDto.min_entry_amount);
    }
    if (updateVaultDto.base_usdt_apy !== undefined) {
      updateData.base_usdt_apy = updateVaultDto.base_usdt_apy;
    }
    if (updateVaultDto.boosted_usdt_apy !== undefined) {
      updateData.boosted_usdt_apy = updateVaultDto.boosted_usdt_apy;
    }
    if (updateVaultDto.takara_apr !== undefined) {
      updateData.takara_apr = updateVaultDto.takara_apr;
    }
    if (updateVaultDto.boost_token_symbol !== undefined) {
      updateData.boost_token_symbol = updateVaultDto.boost_token_symbol;
    }
    if (updateVaultDto.boost_ratio !== undefined) {
      updateData.boost_ratio = updateVaultDto.boost_ratio;
    }
    if (updateVaultDto.boost_discount !== undefined) {
      updateData.boost_discount = updateVaultDto.boost_discount;
    }
    if (updateVaultDto.boost_fixed_price !== undefined) {
      updateData.boost_fixed_price = new Decimal(updateVaultDto.boost_fixed_price);
    }
    if (updateVaultDto.target_liquidity !== undefined) {
      updateData.target_liquidity = new Decimal(updateVaultDto.target_liquidity);
    }
    if (updateVaultDto.is_active !== undefined) {
      updateData.is_active = updateVaultDto.is_active;
    }

    return this.prisma.vault.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete vault (soft delete by setting is_active = false)
   */
  async remove(id: number): Promise<any> {
    await this.findOne(id);
    return this.prisma.vault.update({
      where: { id },
      data: { is_active: false },
    });
  }

  /**
   * Process deposit and handle batch auto-scaling
   * Called when a new deposit is confirmed
   */
  async processDeposit(
    vaultId: number,
    depositAmount: number,
  ): Promise<{ batchNumber: number; batchStatus: string }> {
    return this.prisma.$transaction(async (tx) => {
      const vault = await tx.vault.findUnique({ where: { id: vaultId } });

      if (!vault) {
        throw new NotFoundException(`Vault ${vaultId} not found`);
      }

      if (!vault.is_active) {
        throw new BadRequestException(`Vault ${vaultId} is not active`);
      }

      // Update current liquidity
      const newLiquidity = Number(vault.current_liquidity) + depositAmount;
      const targetLiquidity = Number(vault.target_liquidity);

      let newBatchNumber = vault.batch_number;
      let newBatchStatus = vault.batch_status;

      // Check if batch is filled
      if (newLiquidity >= targetLiquidity) {
        // Mark current batch as FILLED and start new batch
        newBatchStatus = 'FILLED';
        newBatchNumber = vault.batch_number + 1;

        // Update vault with new batch
        await tx.vault.update({
          where: { id: vaultId },
          data: {
            current_liquidity: new Decimal(newLiquidity - targetLiquidity), // Overflow goes to new batch
            batch_number: newBatchNumber,
            batch_status: 'COLLECTING',
          },
        });

        // Return the old batch number for the deposit
        return {
          batchNumber: vault.batch_number,
          batchStatus: 'FILLED',
        };
      }

      // Update vault liquidity
      await tx.vault.update({
        where: { id: vaultId },
        data: {
          current_liquidity: new Decimal(newLiquidity),
        },
      });

      return {
        batchNumber: vault.batch_number,
        batchStatus: vault.batch_status,
      };
    });
  }

  /**
   * Calculate USDT yield for a deposit
   */
  calculateUsdtYield(
    depositAmount: number,
    baseApy: number,
    boostedApy: number,
    hasBoosted: boolean,
    frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
  ): {
    effectiveApy: number;
    dailyReward: number;
    monthlyReward: number;
    yearlyReward: number;
  } {
    const apy = hasBoosted ? boostedApy : baseApy;
    const multiplier = FREQUENCY_MULTIPLIERS[frequency];
    const effectiveApy = apy * multiplier;

    const yearlyReward = (depositAmount * effectiveApy) / 100;
    const dailyReward = yearlyReward / 365;
    const monthlyReward = yearlyReward / 12;

    return {
      effectiveApy,
      dailyReward,
      monthlyReward,
      yearlyReward,
    };
  }

  /**
   * Calculate Takara mining yield for a deposit
   */
  calculateTakaraYield(
    depositAmount: number,
    takaraApr: number,
  ): {
    dailyTokens: number;
    weeklyTokens: number;
    monthlyTokens: number;
    yearlyTokens: number;
    yearlyValueUsd: number;
  } {
    const yearlyValueUsd = (depositAmount * takaraApr) / 100;
    const yearlyTokens = yearlyValueUsd / TAKARA_INTERNAL_PRICE;
    const monthlyTokens = yearlyTokens / 12;
    const weeklyTokens = yearlyTokens / 52;
    const dailyTokens = yearlyTokens / 365;

    return {
      dailyTokens,
      weeklyTokens,
      monthlyTokens,
      yearlyTokens,
      yearlyValueUsd,
    };
  }

  /**
   * Check if Laika boost is eligible (Vault 1)
   * Requirement: 40% of deposit value in Laika at discounted price (-15%)
   */
  checkLaikaBoostEligibility(
    depositAmount: number,
    laikaBalance: number,
    laikaMarketPrice: number,
    discountRate: number = 0.15,
  ): {
    isEligible: boolean;
    requiredUsd: number;
    requiredTokens: number;
    currentValueUsd: number;
  } {
    const discountedPrice = laikaMarketPrice * (1 - discountRate);
    const requiredUsd = depositAmount * 0.4; // 40% of deposit
    const requiredTokens = requiredUsd / discountedPrice;
    const currentValueUsd = laikaBalance * discountedPrice;

    return {
      isEligible: currentValueUsd >= requiredUsd,
      requiredUsd,
      requiredTokens,
      currentValueUsd,
    };
  }

  /**
   * Check if Takara boost is eligible (Vault 2, 3)
   * Requirement: 1:1 ratio with deposit at fixed price $0.10
   */
  checkTakaraBoostEligibility(
    depositAmount: number,
    takaraBalance: number,
    fixedPrice: number = TAKARA_INTERNAL_PRICE,
  ): {
    isEligible: boolean;
    requiredUsd: number;
    requiredTokens: number;
    currentValueUsd: number;
  } {
    const requiredUsd = depositAmount; // 1:1 ratio
    const requiredTokens = requiredUsd / fixedPrice;
    const currentValueUsd = takaraBalance * fixedPrice;

    return {
      isEligible: currentValueUsd >= requiredUsd,
      requiredUsd,
      requiredTokens,
      currentValueUsd,
    };
  }

  /**
   * Get vault yields summary for all vaults
   */
  async getVaultYields(): Promise<any[]> {
    const vaults = await this.findAll();

    return vaults.map((vault) => ({
      vaultId: vault.id,
      name: vault.name,
      type: vault.type,
      durationMonths: vault.duration_months,
      minEntryAmount: Number(vault.min_entry_amount),
      usdtYield: {
        baseApy: vault.base_usdt_apy,
        boostedApy: vault.boosted_usdt_apy,
        frequencyMultipliers: FREQUENCY_MULTIPLIERS,
      },
      takaraYield: {
        apr: vault.takara_apr,
        internalPrice: TAKARA_INTERNAL_PRICE,
      },
      boostCondition: {
        tokenSymbol: vault.boost_token_symbol,
        ratio: vault.boost_ratio,
        discount: vault.boost_discount,
        fixedPrice: vault.boost_fixed_price
          ? Number(vault.boost_fixed_price)
          : null,
      },
      batch: {
        number: vault.batch_number,
        status: vault.batch_status,
        currentLiquidity: Number(vault.current_liquidity),
        targetLiquidity: Number(vault.target_liquidity),
        progress:
          (Number(vault.current_liquidity) / Number(vault.target_liquidity)) *
          100,
      },
    }));
  }

  /**
   * Seed default vaults according to TZ specification
   */
  async seedDefaultVaults(): Promise<void> {
    const existingVaults = await this.prisma.vault.count();
    if (existingVaults > 0) {
      console.log('Vaults already exist, skipping seed');
      return;
    }

    const defaultVaults = [
      {
        name: 'Starter',
        type: 'VAULT_1' as const,
        duration_months: 12,
        min_entry_amount: new Decimal(100),
        base_usdt_apy: 4.0,
        boosted_usdt_apy: 8.4, // MAX APY with all conditions
        takara_apr: 30.0,
        boost_token_symbol: 'LAIKA',
        boost_ratio: 0.4, // 40% of deposit
        boost_discount: 0.15, // 15% market price discount
        boost_fixed_price: null,
        target_liquidity: new Decimal(100000),
        lock_months: 12,
      },
      {
        name: 'Advanced',
        type: 'VAULT_2' as const,
        duration_months: 30,
        min_entry_amount: new Decimal(1500),
        base_usdt_apy: 4.0,
        boosted_usdt_apy: 8.0, // With Takara 1:1 boost
        takara_apr: 30.0,
        boost_token_symbol: 'TAKARA',
        boost_ratio: 1.0, // 1:1 ratio
        boost_discount: 0,
        boost_fixed_price: new Decimal(0.1), // Fixed $0.10
        target_liquidity: new Decimal(100000),
        lock_months: 30,
      },
      {
        name: 'Whale',
        type: 'VAULT_3' as const,
        duration_months: 36,
        min_entry_amount: new Decimal(5000),
        base_usdt_apy: 6.0,
        boosted_usdt_apy: 10.0, // With Takara 1:1 boost
        takara_apr: 40.0,
        boost_token_symbol: 'TAKARA',
        boost_ratio: 1.0, // 1:1 ratio
        boost_discount: 0,
        boost_fixed_price: new Decimal(0.1), // Fixed $0.10
        target_liquidity: new Decimal(100000),
        lock_months: 36,
      },
    ];

    for (const vault of defaultVaults) {
      await this.prisma.vault.create({ data: vault });
    }

    console.log('Default vaults seeded successfully');
  }
}
