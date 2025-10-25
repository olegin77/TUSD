import { PrismaService } from '../../database/prisma.service';
export declare class PoolsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(data: {
        apy_base_bp: number;
        lock_months: number;
        min_deposit_usd: bigint;
        boost_target_bp?: number;
        boost_max_bp?: number;
    }): Promise<any>;
    update(id: number, data: Partial<{
        apy_base_bp: number;
        lock_months: number;
        min_deposit_usd: bigint;
        boost_target_bp: number;
        boost_max_bp: number;
        is_active: boolean;
    }>): Promise<any>;
    getStats(): Promise<{
        totalPools: any;
        totalLiquidity: any;
        totalWexels: any;
    }>;
}
