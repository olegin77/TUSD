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
    async getPrice(tokenMint) {
        const price = await this.prisma.tokenPrice.findUnique({
            where: { token_mint: tokenMint },
        });
        if (!price) {
            throw new Error(`Price not found for token: ${tokenMint}`);
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
            where: { token_mint: tokenMint },
            update: {
                price_usd: priceUsd,
                source: source,
                updated_at: new Date(),
            },
            create: {
                token_mint: tokenMint,
                price_usd: priceUsd,
                source: source,
            },
        });
    }
    async getAllPrices() {
        return this.prisma.tokenPrice.findMany({
            orderBy: { updated_at: 'desc' },
        });
    }
    async calculateBoostValue(tokenMint, amount) {
        const price = await this.getPrice(tokenMint);
        return (amount * price.priceUsd) / BigInt(1000000);
    }
    async calculateBoostApy(principalUsd, boostValueUsd) {
        const boostTarget = (principalUsd * BigInt(3000)) / BigInt(10000);
        const boostRatio = (boostValueUsd * BigInt(10000)) / boostTarget;
        const maxBoostBp = BigInt(500);
        if (boostRatio > BigInt(10000)) {
            return Number(maxBoostBp);
        }
        return Number((boostRatio * maxBoostBp) / BigInt(10000));
    }
};
exports.OraclesService = OraclesService;
exports.OraclesService = OraclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OraclesService);
//# sourceMappingURL=oracles.service.js.map