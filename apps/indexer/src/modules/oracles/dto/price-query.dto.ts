import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class PriceQueryDto {
  @IsString()
  @IsNotEmpty()
  token_mint: string;

  @IsOptional()
  @IsString()
  @IsIn(['pyth', 'chainlink', 'dex', 'cex', 'aggregated'])
  source?: string;
}
