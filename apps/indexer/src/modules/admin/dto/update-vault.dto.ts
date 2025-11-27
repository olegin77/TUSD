import {
  IsInt,
  IsPositive,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Comprehensive validation for vault updates
 */
export class UpdateVaultDto {
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Base USDT APY must be at least 0' })
  @Max(100, { message: 'Base USDT APY cannot exceed 100%' })
  base_usdt_apy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Boosted USDT APY must be at least 0' })
  @Max(100, { message: 'Boosted USDT APY cannot exceed 100%' })
  boosted_usdt_apy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Takara APR must be at least 0' })
  @Max(100, { message: 'Takara APR cannot exceed 100%' })
  takara_apr?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1, { message: 'Duration must be at least 1 month' })
  @Max(60, { message: 'Duration cannot exceed 60 months' })
  duration_months?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
