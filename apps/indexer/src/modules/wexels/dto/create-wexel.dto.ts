import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWexelDto {
  @IsOptional()
  @IsString()
  owner_solana?: string;

  @IsOptional()
  @IsString()
  owner_tron?: string;

  @IsInt()
  @IsPositive()
  vault_id: number;

  @Type(() => BigInt)
  @IsPositive()
  principal_usd: bigint;

  @IsInt()
  @IsPositive()
  @Min(1800) // 18%
  @Max(3600) // 36%
  apy_base_bp: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000) // 10%
  apy_boost_bp?: number = 0;

  @IsDateString()
  start_ts: string;

  @IsDateString()
  end_ts: string;

  @IsOptional()
  @IsBoolean()
  is_collateralized?: boolean = false;

  @IsOptional()
  @IsString()
  nft_mint_address?: string;

  @IsOptional()
  @IsString()
  nft_token_address?: string;
}
