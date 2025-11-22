import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class LoginDto {
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
}
