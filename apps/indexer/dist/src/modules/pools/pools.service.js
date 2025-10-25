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
exports.PoolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PoolsService = class PoolsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.pool.findMany({
            where: { is_active: true },
            orderBy: { apy_base_bp: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.pool.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.pool.create({
            data: {
                apy_base_bp: data.apy_base_bp,
                lock_months: data.lock_months,
                min_deposit_usd: data.min_deposit_usd,
                boost_target_bp: data.boost_target_bp || 3000,
                boost_max_bp: data.boost_max_bp || 500,
            },
        });
    }
    async update(id, data) {
        return this.prisma.pool.update({
            where: { id },
            data,
        });
    }
    async getStats() {
        const [totalPools, totalLiquidity, totalWexels] = await Promise.all([
            this.prisma.pool.count({ where: { is_active: true } }),
            this.prisma.pool.aggregate({
                where: { is_active: true },
                _sum: { total_liquidity: true },
            }),
            this.prisma.pool.aggregate({
                where: { is_active: true },
                _sum: { total_wexels: true },
            }),
        ]);
        return {
            totalPools,
            totalLiquidity: totalLiquidity._sum.total_liquidity || BigInt(0),
            totalWexels: totalWexels._sum.total_wexels || BigInt(0),
        };
    }
};
exports.PoolsService = PoolsService;
exports.PoolsService = PoolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PoolsService);
//# sourceMappingURL=pools.service.js.map