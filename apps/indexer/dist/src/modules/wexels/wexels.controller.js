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
exports.WexelsController = exports.RepayLoanDto = exports.CollateralizeDto = exports.ClaimRewardsDto = void 0;
const common_1 = require("@nestjs/common");
const wexels_service_1 = require("./wexels.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class ClaimRewardsDto {
    amount;
    txHash;
}
exports.ClaimRewardsDto = ClaimRewardsDto;
class CollateralizeDto {
    wexelId;
}
exports.CollateralizeDto = CollateralizeDto;
class RepayLoanDto {
    wexelId;
    amount;
}
exports.RepayLoanDto = RepayLoanDto;
let WexelsController = class WexelsController {
    wexelsService;
    constructor(wexelsService) {
        this.wexelsService = wexelsService;
    }
    findByOwner(req) {
        const address = req.user.solanaAddress || req.user.tronAddress;
        return this.wexelsService.findByOwner(address);
    }
    findOne(id) {
        return this.wexelsService.findOne(BigInt(id));
    }
    calculateRewards(id) {
        return this.wexelsService.calculateRewards(BigInt(id));
    }
    claimRewards(id, claimRewardsDto) {
        return this.wexelsService.claimRewards(BigInt(id), BigInt(claimRewardsDto.amount), claimRewardsDto.txHash);
    }
    collateralize(collateralizeDto) {
        return this.wexelsService.collateralize(BigInt(collateralizeDto.wexelId));
    }
    repayLoan(repayLoanDto) {
        return this.wexelsService.repayLoan(BigInt(repayLoanDto.wexelId), BigInt(repayLoanDto.amount));
    }
};
exports.WexelsController = WexelsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/rewards'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "calculateRewards", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/claim'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ClaimRewardsDto]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "claimRewards", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('collateralize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CollateralizeDto]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "collateralize", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('repay-loan'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RepayLoanDto]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "repayLoan", null);
exports.WexelsController = WexelsController = __decorate([
    (0, common_1.Controller)('wexels'),
    __metadata("design:paramtypes", [wexels_service_1.WexelsService])
], WexelsController);
//# sourceMappingURL=wexels.controller.js.map