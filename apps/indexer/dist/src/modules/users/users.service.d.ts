import { PrismaService } from '../../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByAddress(address: string): Promise<any>;
    findOne(id: bigint): Promise<any>;
    create(data: {
        solana_address?: string;
        tron_address?: string;
        email?: string;
        telegram_id?: string;
    }): Promise<any>;
    update(id: bigint, data: {
        email?: string;
        telegram_id?: string;
        is_kyc_verified?: boolean;
        is_active?: boolean;
    }): Promise<any>;
    linkWallet(id: bigint, walletType: 'solana' | 'tron', address: string): Promise<any>;
    getStats(id: bigint): Promise<{
        totalWexels: any;
        totalDeposits: any;
        totalClaims: any;
    }>;
}
