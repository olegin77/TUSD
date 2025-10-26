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
exports.OraclesController = void 0;
const common_1 = require("@nestjs/common");
const oracles_service_1 = require("./oracles.service");
let OraclesController = class OraclesController {
    oraclesService;
    constructor(oraclesService) {
        this.oraclesService = oraclesService;
    }
    async getPrice(tokenMint, source) {
        return this.oraclesService.getPrice(tokenMint, source);
    }
    async updatePrice(body) {
        return this.oraclesService.updatePrice(body.tokenMint, body.priceUsd, body.source);
    }
    async getAllPrices() {
        return this.oraclesService.getAllPrices();
    }
    async calculateBoostApy(body) {
        return {
            boostApy: await this.oraclesService.calculateBoostApy(body.baseApy, body.boostAmount, body.targetAmount),
        };
    }
};
exports.OraclesController = OraclesController;
__decorate([
    (0, common_1.Get)('price/:tokenMint'),
    __param(0, (0, common_1.Param)('tokenMint')),
    __param(1, (0, common_1.Query)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OraclesController.prototype, "getPrice", null);
__decorate([
    (0, common_1.Post)('price'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OraclesController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Get)('prices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OraclesController.prototype, "getAllPrices", null);
__decorate([
    (0, common_1.Post)('calculate-boost-apy'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OraclesController.prototype, "calculateBoostApy", null);
exports.OraclesController = OraclesController = __decorate([
    (0, common_1.Controller)('oracles'),
    __metadata("design:paramtypes", [oracles_service_1.OraclesService])
], OraclesController);
//# sourceMappingURL=oracles.controller.js.map