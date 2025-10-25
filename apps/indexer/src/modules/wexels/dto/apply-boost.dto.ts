import { IsString, IsPositive, IsInt, Min, Max } from 'class-validator';
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
}
