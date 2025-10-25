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
exports.WexelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let WexelsService = class WexelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByOwner(ownerAddress) {
        return this.prisma.wexel.findMany({
            where: {
                OR: [
                    { owner_solana: ownerAddress },
                    { owner_tron: ownerAddress },
                ],
            },
            include: {
                pool: true,
                collateral_position: true,
                listings: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.wexel.findUnique({
            where: { id },
            include: {
                pool: true,
                collateral_position: true,
                listings: true,
                claims: {
                    orderBy: { created_at: 'desc' },
                },
                boosts: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });
    }
    async create(data) {
        return this.prisma.wexel.create({
            data,
            include: {
                pool: true,
            },
        });
    }
    async calculateRewards(wexelId) {
        const wexel = await this.prisma.wexel.findUnique({
            where: { id: wexelId },
        });
        if (!wexel) {
            throw new Error('Wexel not found');
        }
        const now = new Date();
        const startTime = wexel.start_ts;
        const endTime = wexel.end_ts;
        const daysElapsed = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));
        const totalDays = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));
        const totalApyBp = wexel.apy_base_bp + wexel.apy_boost_bp;
        const dailyReward = (wexel.principal_usd * BigInt(totalApyBp)) / BigInt(365 * 10000);
        const totalRewards = dailyReward * BigInt(daysElapsed);
        const claimedRewards = wexel.total_claimed_usd;
        const pendingRewards = totalRewards - claimedRewards;
        return {
            wexelId,
            principal: wexel.principal_usd,
            apyBase: wexel.apy_base_bp,
            apyBoost: wexel.apy_boost_bp,
            totalApy: totalApyBp,
            dailyReward,
            daysElapsed,
            totalDays,
            totalRewards,
            claimedRewards,
            pendingRewards,
            isMatured: now >= endTime,
        };
    }
    async claimRewards(wexelId, amount, txHash) {
        const wexel = await this.prisma.wexel.findUnique({
            where: { id: wexelId },
        });
        if (!wexel) {
            throw new Error('Wexel not found');
        }
        const claim = await this.prisma.claim.create({
            data: {
                wexel_id: wexelId,
                amount_usd: amount,
                claim_type: 'daily',
                tx_hash: txHash,
            },
        });
        await this.prisma.wexel.update({
            where: { id: wexelId },
            data: {
                total_claimed_usd: wexel.total_claimed_usd + amount,
            },
        });
        return claim;
    }
    async collateralize(wexelId) {
        const wexel = await this.prisma.wexel.findUnique({
            where: { id: wexelId },
        });
        if (!wexel) {
            throw new Error('Wexel not found');
        }
        if (wexel.is_collateralized) {
            throw new Error('Wexel already collateralized');
        }
        const loanAmount = (wexel.principal_usd * BigInt(6000)) / BigInt(10000);
        const collateralPosition = await this.prisma.collateralPosition.create({
            data: {
                wexel_id: wexelId,
                loan_usd: loanAmount,
                start_ts: new Date(),
            },
        });
        await this.prisma.wexel.update({
            where: { id: wexelId },
            data: {
                is_collateralized: true,
            },
        });
        return collateralPosition;
    }
    async repayLoan(wexelId, amount) {
        const collateralPosition = await this.prisma.collateralPosition.findUnique({
            where: { wexel_id: wexelId },
        });
        if (!collateralPosition) {
            throw new Error('Collateral position not found');
        }
        if (collateralPosition.repaid) {
            throw new Error('Loan already repaid');
        }
        await this.prisma.collateralPosition.update({
            where: { wexel_id: wexelId },
            data: {
                repaid: true,
            },
        });
        await this.prisma.wexel.update({
            where: { id: wexelId },
            data: {
                is_collateralized: false,
            },
        });
        return { success: true, repaidAmount: amount };
    }
};
exports.WexelsService = WexelsService;
exports.WexelsService = WexelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WexelsService);
//# sourceMappingURL=wexels.service.js.map