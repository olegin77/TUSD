import { PrismaService } from '../../database/prisma.service';
export declare class OraclesService {
    private prisma;
    constructor(prisma: PrismaService);
    getPrice(tokenMint: string, source?: string): Promise<{
        tokenMint: any;
        priceUsd: any;
        source: any;
        updatedAt: any;
    }>;
    updatePrice(tokenMint: string, priceUsd: number, source: string): Promise<any>;
    getAllPrices(): Promise<any>;
    calculateBoostApy(baseApy: number, boostAmount: number, targetAmount: number): Promise<number>;
}
