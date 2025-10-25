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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsController = exports.UpdatePoolDto = exports.CreatePoolDto = void 0;
const common_1 = require("@nestjs/common");
const pools_service_1 = require("./pools.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class CreatePoolDto {
    apy_base_bp;
    lock_months;
    min_deposit_usd;
    boost_target_bp;
    boost_max_bp;
}
exports.CreatePoolDto = CreatePoolDto;
class UpdatePoolDto {
    apy_base_bp;
    lock_months;
    min_deposit_usd;
    boost_target_bp;
    boost_max_bp;
    is_active;
}
exports.UpdatePoolDto = UpdatePoolDto;
let PoolsController = class PoolsController {
    poolsService;
    constructor(poolsService) {
        this.poolsService = poolsService;
    }
    findAll() {
        return this.poolsService.findAll();
    }
    getStats() {
        return this.poolsService.getStats();
    }
    findOne(id) {
        return this.poolsService.findOne(id);
    }
    create(createPoolDto) {
        return this.poolsService.create({
            ...createPoolDto,
            min_deposit_usd: BigInt(createPoolDto.min_deposit_usd),
        });
    }
    update(id, updatePoolDto) {
        const data = { ...updatePoolDto };
        if (updatePoolDto.min_deposit_usd) {
            data.min_deposit_usd = BigInt(updatePoolDto.min_deposit_usd);
        }
        return this.poolsService.update(id, data);
    }
};
exports.PoolsController = PoolsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PoolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PoolsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PoolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePoolDto]),
    __metadata("design:returntype", void 0)
], PoolsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdatePoolDto]),
    __metadata("design:returntype", void 0)
], PoolsController.prototype, "update", null);
exports.PoolsController = PoolsController = __decorate([
    (0, common_1.Controller)('pools'),
    __metadata("design:paramtypes", [pools_service_1.PoolsService])
], PoolsController);
//# sourceMappingURL=pools.controller.js.map