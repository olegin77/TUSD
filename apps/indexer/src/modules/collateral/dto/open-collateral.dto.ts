import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class OpenCollateralDto {
  @IsString()
  @IsOptional()
  txHash?: string;

  @IsString()
  @IsNotEmpty()
  userAddress: string;
}
