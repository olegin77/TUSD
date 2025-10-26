import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: any;
            solanaAddress: any;
            tronAddress: any;
            email: any;
            isKycVerified: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            solanaAddress: any;
            tronAddress: any;
            email: any;
            isKycVerified: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        token: string;
    }>;
    getProfile(req: any): any;
    verify(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
