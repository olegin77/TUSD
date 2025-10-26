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
exports.OraclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let OraclesService = class OraclesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPrice(tokenMint, source) {
        const price = await this.prisma.tokenPrice.findFirst({
            where: {
                token_mint: tokenMint,
                ...(source && { source }),
            },
            orderBy: { updated_at: 'desc' },
        });
        if (!price) {
            throw new common_1.NotFoundException(`Price for token ${tokenMint} not found`);
        }
        return {
            tokenMint: price.token_mint,
            priceUsd: price.price_usd,
            source: price.source,
            updatedAt: price.updated_at,
        };
    }
    async updatePrice(tokenMint, priceUsd, source) {
        return this.prisma.tokenPrice.upsert({
            where: {
                token_mint_source: {
                    token_mint: tokenMint,
                    source,
                },
            },
            update: {
                price_usd: priceUsd,
                updated_at: new Date(),
            },
            create: {
                token_mint: tokenMint,
                price_usd: priceUsd,
                source,
            },
        });
    }
    async getAllPrices() {
        return this.prisma.tokenPrice.findMany({
            orderBy: { updated_at: 'desc' },
        });
    }
    async calculateBoostApy(baseApy, boostAmount, targetAmount) {
        if (targetAmount === 0)
            return baseApy;
        const boostRatio = Math.min(boostAmount / targetAmount, 1);
        const maxBoost = 0.1;
        const boostApy = baseApy * (1 + boostRatio * maxBoost);
        return Math.round(boostApy * 100) / 100;
    }
};
exports.OraclesService = OraclesService;
exports.OraclesService = OraclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OraclesService);
//# sourceMappingURL=oracles.service.js.map