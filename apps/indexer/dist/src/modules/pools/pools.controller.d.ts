import { PoolsService } from './pools.service';
export declare class CreatePoolDto {
    apy_base_bp: number;
    lock_months: number;
    min_deposit_usd: string;
    boost_target_bp?: number;
    boost_max_bp?: number;
}
export declare class UpdatePoolDto {
    apy_base_bp?: number;
    lock_months?: number;
    min_deposit_usd?: string;
    boost_target_bp?: number;
    boost_max_bp?: number;
    is_active?: boolean;
}
export declare class PoolsController {
    private readonly poolsService;
    constructor(poolsService: PoolsService);
    findAll(): Promise<any>;
    getStats(): Promise<{
        totalPools: any;
        totalLiquidity: any;
        totalWexels: any;
    }>;
    findOne(id: number): Promise<any>;
    create(createPoolDto: CreatePoolDto): Promise<any>;
    update(id: number, updatePoolDto: UpdatePoolDto): Promise<any>;
}
