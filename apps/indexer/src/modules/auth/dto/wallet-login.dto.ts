import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum WalletType {
  SOLANA = 'solana',
  TRON = 'tron',
}

export class WalletLoginDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(WalletType)
  @IsNotEmpty()
  walletType: WalletType;
}

export class WalletVerifyDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsEnum(WalletType)
  @IsNotEmpty()
  walletType: WalletType;
}
