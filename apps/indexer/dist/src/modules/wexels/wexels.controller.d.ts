import { WexelsService } from './wexels.service';
export declare class ClaimRewardsDto {
    amount: string;
    txHash?: string;
}
export declare class CollateralizeDto {
    wexelId: string;
}
export declare class RepayLoanDto {
    wexelId: string;
    amount: string;
}
export declare class WexelsController {
    private readonly wexelsService;
    constructor(wexelsService: WexelsService);
    findByOwner(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    calculateRewards(id: string): Promise<{
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
    claimRewards(id: string, claimRewardsDto: ClaimRewardsDto): Promise<any>;
    collateralize(collateralizeDto: CollateralizeDto): Promise<any>;
    repayLoan(repayLoanDto: RepayLoanDto): Promise<{
        success: boolean;
        repaidAmount: bigint;
    }>;
}
