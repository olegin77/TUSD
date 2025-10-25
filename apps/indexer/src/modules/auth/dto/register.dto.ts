import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  solana_address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tron_address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  telegram_id?: string;

  @IsOptional()
  @IsBoolean()
  is_kyc_verified?: boolean = false;
}
