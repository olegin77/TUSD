"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../database/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const user = await this.prisma.user.create({
            data: {
                solana_address: registerDto.solana_address,
                tron_address: registerDto.tron_address,
                email: registerDto.email,
                password: registerDto.password,
                telegram_id: registerDto.telegram_id,
                is_kyc_verified: registerDto.is_kyc_verified || false,
            },
        });
        const payload = {
            sub: user.id,
            solanaAddress: user.solana_address,
            tronAddress: user.tron_address,
        };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                solanaAddress: user.solana_address,
                tronAddress: user.tron_address,
                email: user.email,
                isKycVerified: user.is_kyc_verified,
                isActive: user.is_active,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            },
            token,
        };
    }
    async login(loginDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { solana_address: loginDto.solana_address },
                    { tron_address: loginDto.tron_address },
                    { email: loginDto.email },
                ],
            },
        });
        if (!user || user.password !== loginDto.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            solanaAddress: user.solana_address,
            tronAddress: user.tron_address,
        };
        const token = this.jwtService.sign(payload);
        return {
            user: {
                id: user.id,
                solanaAddress: user.solana_address,
                tronAddress: user.tron_address,
                email: user.email,
                isKycVerified: user.is_kyc_verified,
                isActive: user.is_active,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            },
            token,
        };
    }
    async verifyToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return {
                id: user.id,
                solanaAddress: user.solana_address,
                tronAddress: user.tron_address,
                email: user.email,
                isKycVerified: user.is_kyc_verified,
                isActive: user.is_active,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map