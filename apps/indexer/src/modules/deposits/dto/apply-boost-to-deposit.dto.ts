import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class ApplyBoostToDepositDto {
  @IsString()
  @IsNotEmpty()
  tokenMint: string;

  @IsString()
  @IsNotEmpty()
  amount: string; // String to handle BigInt

  @IsString()
  @IsNotEmpty()
  valueUsd: string; // String to handle BigInt

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  apyBoostBp: number;

  @IsString()
  @IsNotEmpty()
  priceUsd: string; // String to handle BigInt
}
