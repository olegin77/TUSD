import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    verifyToken(token: string): Promise<{
        id: any;
        solanaAddress: any;
        tronAddress: any;
        email: any;
        isKycVerified: any;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }>;
}
