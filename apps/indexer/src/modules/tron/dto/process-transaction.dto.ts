import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ProcessTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{64}$/, {
    message: 'Invalid Tron transaction hash format',
  })
  txHash: string;
}
