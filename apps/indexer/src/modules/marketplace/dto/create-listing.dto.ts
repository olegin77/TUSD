import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  wexelId: string; // String to handle BigInt

  @IsString()
  @IsNotEmpty()
  askPriceUsd: string; // String to handle BigInt

  @IsBoolean()
  @IsOptional()
  auction?: boolean;

  @IsString()
  @IsOptional()
  minBidUsd?: string; // String to handle BigInt

  @IsString()
  @IsOptional()
  expiryTs?: string; // ISO date string
}
