import { UsersService } from './users.service';
export declare class UpdateUserDto {
    email?: string;
    telegram_id?: string;
    is_kyc_verified?: boolean;
    is_active?: boolean;
}
export declare class LinkWalletDto {
    walletType: 'solana' | 'tron';
    address: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<any>;
    getStats(req: any): Promise<{
        totalWexels: any;
        totalDeposits: any;
        totalClaims: any;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<any>;
    linkWallet(req: any, linkWalletDto: LinkWalletDto): Promise<any>;
}
