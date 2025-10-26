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
    async create(createWexelDto) {
        return this.prisma.wexel.create({
            data: createWexelDto,
        });
    }
    async findAll() {
        return this.prisma.wexel.findMany({
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const wexel = await this.prisma.wexel.findUnique({
            where: { id: BigInt(id) },
        });
        if (!wexel) {
            throw new common_1.NotFoundException(`Wexel with ID ${id} not found`);
        }
        return wexel;
    }
    async applyBoost(applyBoostDto) {
        const wexel = await this.findOne(applyBoostDto.wexel_id.toString());
        return this.prisma.boost.create({
            data: {
                wexel_id: applyBoostDto.wexel_id,
                token_mint: applyBoostDto.token_mint,
                amount: applyBoostDto.amount,
            },
        });
    }
    async update(id, updateWexelDto) {
        await this.findOne(id);
        return this.prisma.wexel.update({
            where: { id: BigInt(id) },
            data: updateWexelDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.wexel.delete({
            where: { id: BigInt(id) },
        });
    }
};
exports.WexelsService = WexelsService;
exports.WexelsService = WexelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WexelsService);
//# sourceMappingURL=wexels.service.js.map