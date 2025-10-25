import { PrismaService } from '../../database/prisma.service';
export declare class WexelsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByOwner(ownerAddress: string): Promise<any>;
    findOne(id: bigint): Promise<any>;
    create(data: {
        owner_solana?: string;
        owner_tron?: string;
        pool_id: number;
        principal_usd: bigint;
        apy_base_bp: number;
        start_ts: Date;
        end_ts: Date;
        nft_mint_address?: string;
        nft_token_address?: string;
    }): Promise<any>;
    calculateRewards(wexelId: bigint): Promise<{
        wexelId: bigint;
        principal: any;
        apyBase: any;
        apyBoost: any;
        totalApy: any;
        dailyReward: bigint;
        daysElapsed: number;
        totalDays: number;
        totalRewards: bigint;
        claimedRewards: any;
        pendingRewards: bigint;
        isMatured: boolean;
    }>;
    claimRewards(wexelId: bigint, amount: bigint, txHash?: string): Promise<any>;
    collateralize(wexelId: bigint): Promise<any>;
    repayLoan(wexelId: bigint, amount: bigint): Promise<{
        success: boolean;
        repaidAmount: bigint;
    }>;
}
