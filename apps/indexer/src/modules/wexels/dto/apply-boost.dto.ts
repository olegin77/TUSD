import {
  IsString,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ApplyBoostDto {
  @Type(() => BigInt)
  @IsPositive()
  wexel_id: bigint;

  @IsString()
  token_mint: string;

  @Type(() => BigInt)
  @IsPositive()
  amount: bigint;

  @IsNumber()
  priceUsd: number;

  @IsNumber()
  valueUsd: number;

  @IsInt()
  @Min(0)
  @Max(500)
  apyBoostBp: number;

  @IsOptional()
  @IsString()
  txHash?: string;
}
