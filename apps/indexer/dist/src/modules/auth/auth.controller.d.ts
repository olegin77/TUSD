import { AuthService } from './auth.service';
export declare class LoginDto {
    solanaAddress: string;
    signature: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            solanaAddress: any;
            tronAddress: any;
            email: any;
            isKycVerified: any;
        };
    }>;
    getProfile(req: any): any;
    verify(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
