import { OraclesService } from './oracles.service';
export declare class OraclesController {
    private readonly oraclesService;
    constructor(oraclesService: OraclesService);
    getPrice(tokenMint: string, source?: string): Promise<{
        tokenMint: any;
        priceUsd: any;
        source: any;
        updatedAt: any;
    }>;
    updatePrice(body: {
        tokenMint: string;
        priceUsd: number;
        source: string;
    }): Promise<any>;
    getAllPrices(): Promise<any>;
    calculateBoostApy(body: {
        baseApy: number;
        boostAmount: number;
        targetAmount: number;
    }): Promise<{
        boostApy: number;
    }>;
}
