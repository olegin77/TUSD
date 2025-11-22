import {
  IsInt,
  IsPositive,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

/**
 * MEDIUM-01 FIX: DTO for global settings updates with comprehensive validation
 */
export class UpdateSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Marketplace fee must be at least 0 basis points' })
  @Max(1000, {
    message: 'Marketplace fee cannot exceed 1000 basis points (10%)',
  })
  marketplace_fee_bp?: number;

  @IsOptional()
  @IsString()
  @Matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: 'Invalid Solana address format for multisig',
  })
  multisig_address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: 'Invalid Solana address format for pause guardian',
  })
  pause_guardian_address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: 'Invalid Solana address format for timelock',
  })
  timelock_address?: string;

  @IsOptional()
  @IsBoolean()
  system_paused?: boolean;

  @IsOptional()
  @IsBoolean()
  kyc_required?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1, { message: 'Timelock delay must be at least 1 second' })
  @Max(604800, {
    message: 'Timelock delay cannot exceed 7 days (604800 seconds)',
  })
  timelock_delay_seconds?: number;
}
