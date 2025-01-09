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
var AggregatorController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorController = void 0;
const common_1 = require("@nestjs/common");
const aggregator_service_1 = require("./aggregator.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let AggregatorController = AggregatorController_1 = class AggregatorController {
    constructor(aggregatorService) {
        this.aggregatorService = aggregatorService;
        this.logger = new common_1.Logger(AggregatorController_1.name);
    }
    async create(aggregator) {
        try {
            const response = await this.aggregatorService.create(aggregator);
            return {
                success: true,
                message: 'Aggregator created successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[AggregatorController] [create] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to create aggregator.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const response = await this.aggregatorService.findAll();
            return {
                success: true,
                message: 'Aggregators retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[AggregatorController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to retrieve aggregators.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const response = await this.aggregatorService.findOne(id);
            return {
                success: true,
                message: 'Aggregator retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[AggregatorController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to retrieve aggregator.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            const response = await this.aggregatorService.update(id, updateData);
            return {
                success: true,
                message: 'Aggregator updated successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[AggregatorController] [update] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to update aggregator.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.aggregatorService.remove(id);
            return {
                success: true,
                message: 'Aggregator removed successfully.',
                data: null,
            };
        }
        catch (error) {
            this.logger.error(`[AggregatorController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException('Failed to remove aggregator.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AggregatorController = AggregatorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AggregatorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AggregatorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AggregatorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AggregatorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AggregatorController.prototype, "remove", null);
exports.AggregatorController = AggregatorController = AggregatorController_1 = __decorate([
    (0, common_1.Controller)('aggregator'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [aggregator_service_1.AggregatorService])
], AggregatorController);
//# sourceMappingURL=aggregator.controller.js.map