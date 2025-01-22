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
var ModelController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelController = void 0;
const common_1 = require("@nestjs/common");
const model_service_1 = require("./model.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let ModelController = ModelController_1 = class ModelController {
    constructor(modelService) {
        this.modelService = modelService;
        this.logger = new common_1.Logger(ModelController_1.name);
    }
    async create(model) {
        try {
            const response = await this.modelService.create(model);
            return {
                success: true,
                message: 'Model created successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[ModelController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const response = await this.modelService.findAll();
            return {
                success: true,
                message: 'Models retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[ModelController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const response = await this.modelService.findOne(id);
            return {
                success: true,
                message: 'Model retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[ModelController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to retrieve model.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            const response = await this.modelService.update(id, updateData);
            return {
                success: true,
                message: 'Model updated successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[ModelController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.modelService.remove(id);
            return {
                success: true,
                message: 'Model removed successfully.',
                data: null,
            };
        }
        catch (error) {
            this.logger.error(`[ModelController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ModelController = ModelController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModelController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ModelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ModelController.prototype, "remove", null);
exports.ModelController = ModelController = ModelController_1 = __decorate([
    (0, common_1.Controller)('model'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [model_service_1.ModelService])
], ModelController);
//# sourceMappingURL=model.controller.js.map