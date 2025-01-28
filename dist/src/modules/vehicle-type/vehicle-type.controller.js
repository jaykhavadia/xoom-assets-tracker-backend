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
var VehicleTypeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTypeController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_type_service_1 = require("./vehicle-type.service");
const vehicle_type_entity_1 = require("./entities/vehicle-type.entity");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let VehicleTypeController = VehicleTypeController_1 = class VehicleTypeController {
    constructor(vehicleTypeService) {
        this.vehicleTypeService = vehicleTypeService;
        this.logger = new common_1.Logger(VehicleTypeController_1.name);
    }
    async create(vehicleType) {
        try {
            const response = await this.vehicleTypeService.create(vehicleType);
            return {
                success: true,
                message: 'Vehicle type created successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleTypeController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(name, fuel) {
        try {
            const response = await this.vehicleTypeService.findAll(name, fuel);
            return {
                success: true,
                message: 'Vehicle types retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleTypeController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const response = await this.vehicleTypeService.findOne(id);
            return {
                success: true,
                message: 'Vehicle type retrieved successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleTypeController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            const response = await this.vehicleTypeService.update(id, updateData);
            return {
                success: true,
                message: 'Vehicle type updated successfully.',
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleTypeController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.vehicleTypeService.remove(id);
            return {
                success: true,
                message: 'Vehicle type removed successfully.',
                data: null,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleTypeController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.VehicleTypeController = VehicleTypeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_type_entity_1.VehicleType]),
    __metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('fuel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehicleTypeController.prototype, "remove", null);
exports.VehicleTypeController = VehicleTypeController = VehicleTypeController_1 = __decorate([
    (0, common_1.Controller)('vehicle-type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vehicle_type_service_1.VehicleTypeService])
], VehicleTypeController);
//# sourceMappingURL=vehicle-type.controller.js.map