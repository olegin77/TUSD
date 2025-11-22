import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsOptional()
  solana_address?: string;

  @IsString()
  @IsOptional()
  tron_address?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  telegram_id?: string;

  @IsBoolean()
  @IsOptional()
  is_kyc_verified?: boolean;
}
