import {
  IsInt,
  IsPositive,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePoolDto {
  @IsInt()
  @IsPositive()
  @Min(1800) // 18%
  @Max(3600) // 36%
  apy_base_bp: number;

  @IsInt()
  @IsPositive()
  @Min(12)
  @Max(36)
  lock_months: number;

  @Type(() => BigInt)
  @IsPositive()
  min_deposit_usd: bigint;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1000) // 10%
  @Max(5000) // 50%
  boost_target_bp?: number = 3000;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(100) // 1%
  @Max(1000) // 10%
  boost_max_bp?: number = 500;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
