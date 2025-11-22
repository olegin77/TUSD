import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  solana_address?: string;

  @IsOptional()
  @IsString()
  tron_address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telegram_id?: string;

  @IsOptional()
  @IsBoolean()
  is_kyc_verified?: boolean = false;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
