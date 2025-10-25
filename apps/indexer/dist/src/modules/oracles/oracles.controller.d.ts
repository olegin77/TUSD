import { OraclesService } from './oracles.service';
export declare class UpdatePriceDto {
    tokenMint: string;
    priceUsd: string;
    source: string;
}
export declare class CalculateBoostDto {
    tokenMint: string;
    amount: string;
}
export declare class OraclesController {
    private readonly oraclesService;
    constructor(oraclesService: OraclesService);
    getAllPrices(): Promise<any>;
    getPrice(tokenMint: string): Promise<{
        tokenMint: any;
        priceUsd: any;
        source: any;
        updatedAt: any;
    }>;
    updatePrice(updatePriceDto: UpdatePriceDto): Promise<any>;
    calculateBoost(calculateBoostDto: CalculateBoostDto): Promise<bigint>;
}
