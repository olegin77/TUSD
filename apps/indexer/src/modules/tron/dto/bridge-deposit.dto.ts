import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class BridgeDepositDto {
  @IsString()
  @IsNotEmpty()
  depositId: string;

  @IsString()
  @IsNotEmpty()
  tronAddress: string;

  @IsString()
  @IsNotEmpty()
  solanaOwner: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsNumber()
  @Min(1)
  poolId: number;
}
