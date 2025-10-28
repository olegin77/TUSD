import { IsNotEmpty, IsString } from 'class-validator';

export class BuyListingDto {
  @IsString()
  @IsNotEmpty()
  listingId: string; // String to handle BigInt

  @IsString()
  @IsNotEmpty()
  buyerAddress: string;

  @IsString()
  @IsNotEmpty()
  price: string; // String to handle BigInt

  @IsString()
  @IsNotEmpty()
  txHash: string;
}
