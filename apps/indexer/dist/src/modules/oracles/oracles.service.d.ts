import { PrismaService } from '../../database/prisma.service';
export declare class OraclesService {
    private prisma;
    constructor(prisma: PrismaService);
    getPrice(tokenMint: string): Promise<{
        tokenMint: any;
        priceUsd: any;
        source: any;
        updatedAt: any;
    }>;
    updatePrice(tokenMint: string, priceUsd: bigint, source: string): Promise<any>;
    getAllPrices(): Promise<any>;
    calculateBoostValue(tokenMint: string, amount: bigint): Promise<bigint>;
    calculateBoostApy(principalUsd: bigint, boostValueUsd: bigint): Promise<number>;
}
