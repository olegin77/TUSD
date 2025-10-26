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
exports.WexelsController = void 0;
const common_1 = require("@nestjs/common");
const wexels_service_1 = require("./wexels.service");
const create_wexel_dto_1 = require("./dto/create-wexel.dto");
const apply_boost_dto_1 = require("./dto/apply-boost.dto");
let WexelsController = class WexelsController {
    wexelsService;
    constructor(wexelsService) {
        this.wexelsService = wexelsService;
    }
    create(createWexelDto) {
        return this.wexelsService.create(createWexelDto);
    }
    findAll() {
        return this.wexelsService.findAll();
    }
    findOne(id) {
        return this.wexelsService.findOne(id.toString());
    }
    applyBoost(applyBoostDto) {
        return this.wexelsService.applyBoost(applyBoostDto);
    }
    update(id, updateWexelDto) {
        return this.wexelsService.update(id.toString(), updateWexelDto);
    }
    remove(id) {
        return this.wexelsService.remove(id.toString());
    }
};
exports.WexelsController = WexelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wexel_dto_1.CreateWexelDto]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('apply-boost'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_boost_dto_1.ApplyBoostDto]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "applyBoost", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WexelsController.prototype, "remove", null);
exports.WexelsController = WexelsController = __decorate([
    (0, common_1.Controller)('wexels'),
    __metadata("design:paramtypes", [wexels_service_1.WexelsService])
], WexelsController);
//# sourceMappingURL=wexels.controller.js.map