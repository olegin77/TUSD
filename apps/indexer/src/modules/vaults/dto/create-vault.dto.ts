import {
  IsInt,
  IsPositive,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum VaultType {
  VAULT_1 = 'VAULT_1', // Starter (Laika Boost)
  VAULT_2 = 'VAULT_2', // Advanced (Takara Boost)
  VAULT_3 = 'VAULT_3', // Whale (Takara Boost)
}

export class CreateVaultDto {
  @ApiProperty({
    description: 'Vault name',
    example: 'Starter',
    enum: ['Starter', 'Advanced', 'Whale'],
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Vault type',
    enum: VaultType,
    example: VaultType.VAULT_1,
  })
  @IsEnum(VaultType)
  type: VaultType;

  @ApiProperty({
    description: 'Duration in months',
    example: 12,
    minimum: 12,
    maximum: 36,
  })
  @IsInt()
  @IsPositive()
  @Min(12)
  @Max(36)
  duration_months: number;

  @ApiProperty({
    description: 'Minimum entry amount in USD',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  min_entry_amount: number;

  @ApiProperty({
    description: 'Base USDT APY percentage',
    example: 4.0,
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  base_usdt_apy: number;

  @ApiProperty({
    description: 'Boosted USDT APY percentage (with boost conditions met)',
    example: 8.4,
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  boosted_usdt_apy: number;

  @ApiProperty({
    description: 'Takara mining APR percentage',
    example: 30,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  takara_apr: number;

  @ApiProperty({
    description: 'Boost token symbol (LAIKA or TAKARA)',
    example: 'LAIKA',
    enum: ['LAIKA', 'TAKARA'],
  })
  @IsString()
  boost_token_symbol: string;

  @ApiProperty({
    description: 'Boost ratio (0.4 for 40% Laika, 1.0 for 1:1 Takara)',
    example: 0.4,
  })
  @IsNumber()
  @Min(0)
  @Max(2)
  boost_ratio: number;

  @ApiPropertyOptional({
    description: 'Boost discount for market price (0.15 = 15% for Laika)',
    example: 0.15,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  boost_discount?: number = 0;

  @ApiPropertyOptional({
    description: 'Fixed price for Takara boost (null for market price)',
    example: 0.1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  boost_fixed_price?: number;

  @ApiPropertyOptional({
    description: 'Target liquidity for batch (default $100k)',
    example: 100000,
    default: 100000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  target_liquidity?: number = 100000;

  @ApiPropertyOptional({
    description: 'Is vault active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
