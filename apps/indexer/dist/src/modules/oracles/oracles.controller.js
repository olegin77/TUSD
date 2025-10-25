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
exports.OraclesController = exports.CalculateBoostDto = exports.UpdatePriceDto = void 0;
const common_1 = require("@nestjs/common");
const oracles_service_1 = require("./oracles.service");
class UpdatePriceDto {
    tokenMint;
    priceUsd;
    source;
}
exports.UpdatePriceDto = UpdatePriceDto;
class CalculateBoostDto {
    tokenMint;
    amount;
}
exports.CalculateBoostDto = CalculateBoostDto;
let OraclesController = class OraclesController {
    oraclesService;
    constructor(oraclesService) {
        this.oraclesService = oraclesService;
    }
    getAllPrices() {
        return this.oraclesService.getAllPrices();
    }
    getPrice(tokenMint) {
        return this.oraclesService.getPrice(tokenMint);
    }
    updatePrice(updatePriceDto) {
        return this.oraclesService.updatePrice(updatePriceDto.tokenMint, BigInt(updatePriceDto.priceUsd), updatePriceDto.source);
    }
    calculateBoost(calculateBoostDto) {
        return this.oraclesService.calculateBoostValue(calculateBoostDto.tokenMint, BigInt(calculateBoostDto.amount));
    }
};
exports.OraclesController = OraclesController;
__decorate([
    (0, common_1.Get)('prices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OraclesController.prototype, "getAllPrices", null);
__decorate([
    (0, common_1.Get)('prices/:tokenMint'),
    __param(0, (0, common_1.Param)('tokenMint')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OraclesController.prototype, "getPrice", null);
__decorate([
    (0, common_1.Post)('prices'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdatePriceDto]),
    __metadata("design:returntype", void 0)
], OraclesController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Post)('calculate-boost'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculateBoostDto]),
    __metadata("design:returntype", void 0)
], OraclesController.prototype, "calculateBoost", null);
exports.OraclesController = OraclesController = __decorate([
    (0, common_1.Controller)('oracles'),
    __metadata("design:paramtypes", [oracles_service_1.OraclesService])
], OraclesController);
//# sourceMappingURL=oracles.controller.js.map