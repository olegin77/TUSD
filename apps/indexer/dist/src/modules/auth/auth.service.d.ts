import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(solanaAddress: string, signature: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            solanaAddress: any;
            tronAddress: any;
            email: any;
            isKycVerified: any;
        };
    }>;
    verifyToken(token: string): Promise<any>;
}
