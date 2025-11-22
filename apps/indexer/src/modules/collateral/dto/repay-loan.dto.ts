import { IsNotEmpty, IsString } from 'class-validator';

export class RepayLoanDto {
  @IsString()
  @IsNotEmpty()
  repayAmount: string; // String to handle BigInt

  @IsString()
  @IsNotEmpty()
  txHash: string;
}
