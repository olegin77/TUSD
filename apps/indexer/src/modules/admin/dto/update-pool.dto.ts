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
 * MEDIUM-01 FIX: Comprehensive validation for pool updates
 */
export class UpdatePoolDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(0, { message: 'APY must be at least 0 basis points' })
  @Max(10000, { message: 'APY cannot exceed 10000 basis points (100%)' })
  apy_base_bp?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1, { message: 'Lock period must be at least 1 month' })
  @Max(36, { message: 'Lock period cannot exceed 36 months' })
  lock_months?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Minimum deposit must be a number' })
  @Min(0, { message: 'Minimum deposit must be at least 0' })
  min_deposit_usd?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(0, { message: 'Boost target must be at least 0 basis points' })
  @Max(10000, {
    message: 'Boost target cannot exceed 10000 basis points (100%)',
  })
  boost_target_bp?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(0, { message: 'Boost max APY must be at least 0 basis points' })
  @Max(2000, { message: 'Boost max APY cannot exceed 2000 basis points (20%)' })
  boost_max_bp?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
