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
var OwnedByController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnedByController = void 0;
const common_1 = require("@nestjs/common");
const owned_by_service_1 = require("./owned-by.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let OwnedByController = OwnedByController_1 = class OwnedByController {
    constructor(ownedByService) {
        this.ownedByService = ownedByService;
        this.logger = new common_1.Logger(OwnedByController_1.name);
    }
    async create(ownedBy) {
        try {
            const response = await this.ownedByService.create(ownedBy);
            return {
                success: true,
                message: 'OwnedBy record created successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[OwnedByController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const response = await this.ownedByService.findAll();
            return {
                success: true,
                message: 'OwnedBy records retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[OwnedByController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const response = await this.ownedByService.findOne(id);
            return {
                success: true,
                message: 'OwnedBy record retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[OwnedByController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to retrieve ownedBy record.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            const response = await this.ownedByService.update(id, updateData);
            return {
                success: true,
                message: 'OwnedBy record updated successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[OwnedByController] [update] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to update ownedBy record.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.ownedByService.remove(id);
            return {
                success: true,
                message: 'OwnedBy record removed successfully.',
                data: null,
            };
        }
        catch (error) {
            this.logger.error(`[OwnedByController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.OwnedByController = OwnedByController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnedByController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OwnedByController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OwnedByController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OwnedByController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OwnedByController.prototype, "remove", null);
exports.OwnedByController = OwnedByController = OwnedByController_1 = __decorate([
    (0, common_1.Controller)('owned-by'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [owned_by_service_1.OwnedByService])
], OwnedByController);
//# sourceMappingURL=owned-by.controller.js.map