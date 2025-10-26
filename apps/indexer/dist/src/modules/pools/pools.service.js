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
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const pool = await this.prisma.pool.findUnique({
            where: { id },
        });
        if (!pool) {
            throw new common_1.NotFoundException(`Pool with ID ${id} not found`);
        }
        return pool;
    }
    async create(createPoolDto) {
        return this.prisma.pool.create({
            data: {
                apy_base_bp: createPoolDto.apy_base_bp,
                lock_months: createPoolDto.lock_months,
                min_deposit_usd: createPoolDto.min_deposit_usd,
                boost_target_bp: createPoolDto.boost_target_bp,
                boost_max_bp: createPoolDto.boost_max_bp,
                is_active: createPoolDto.is_active,
            },
        });
    }
    async update(id, updatePoolDto) {
        const pool = await this.findOne(id);
        return this.prisma.pool.update({
            where: { id },
            data: {
                ...(updatePoolDto.apy_base_bp !== undefined && {
                    apy_base_bp: updatePoolDto.apy_base_bp,
                }),
                ...(updatePoolDto.lock_months !== undefined && {
                    lock_months: updatePoolDto.lock_months,
                }),
                ...(updatePoolDto.min_deposit_usd !== undefined && {
                    min_deposit_usd: updatePoolDto.min_deposit_usd,
                }),
                ...(updatePoolDto.boost_target_bp !== undefined && {
                    boost_target_bp: updatePoolDto.boost_target_bp,
                }),
                ...(updatePoolDto.boost_max_bp !== undefined && {
                    boost_max_bp: updatePoolDto.boost_max_bp,
                }),
                ...(updatePoolDto.is_active !== undefined && {
                    is_active: updatePoolDto.is_active,
                }),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.pool.delete({
            where: { id },
        });
    }
};
exports.PoolsService = PoolsService;
exports.PoolsService = PoolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PoolsService);
//# sourceMappingURL=pools.service.js.map