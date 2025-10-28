import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum WalletType {
  SOLANA = 'solana',
  TRON = 'tron',
}

export class LinkWalletDto {
  @IsEnum(WalletType)
  @IsNotEmpty()
  walletType: WalletType;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  signature: string; // Подпись для доказательства владения кошельком

  @IsString()
  @IsNotEmpty()
  message: string; // Сообщение которое было подписано
}
