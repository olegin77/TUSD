import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * MEDIUM-01 FIX: DTO for manual price updates with comprehensive validation
 */
export class ManualPriceUpdateDto {
  @IsString()
  @IsNotEmpty({ message: 'Token mint address is required' })
  @Matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: 'Invalid Solana token mint address format',
  })
  mint: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price_usd: number;

  @IsString()
  @IsNotEmpty({ message: 'Reason for manual price update is required' })
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters' })
  reason: string;
}
