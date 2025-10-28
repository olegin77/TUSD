import { IsOptional, IsString } from 'class-validator';

export class MarketplaceFilterDto {
  @IsString()
  @IsOptional()
  minApy?: string;

  @IsString()
  @IsOptional()
  maxPrice?: string;

  @IsString()
  @IsOptional()
  isCollateralized?: string; // 'true' or 'false'

  @IsString()
  @IsOptional()
  sortBy?: string; // 'price', 'apy', 'maturity'
}
