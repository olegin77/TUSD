import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ConfirmDepositDto {
  @IsString()
  @IsNotEmpty()
  txHash: string;

  @IsString()
  @IsOptional()
  wexelId?: string; // String to handle BigInt
}
