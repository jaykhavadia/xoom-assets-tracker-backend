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
var LocationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const location_service_1 = require("./location.service");
const location_entity_1 = require("./entities/location.entity");
const messages_constants_1 = require("../../constants/messages.constants");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let LocationController = LocationController_1 = class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
        this.logger = new common_1.Logger(LocationController_1.name);
    }
    async create(location) {
        try {
            const response = await this.locationService.create(location);
            return {
                success: true,
                message: messages_constants_1.Messages.location.createSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[LocationController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const response = await this.locationService.findAll();
            return {
                success: true,
                message: messages_constants_1.Messages.location.findAllSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[LocationController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.location.findAllFailure, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        const locationId = parseInt(id, 10);
        try {
            const response = await this.locationService.findOne(locationId);
            if (!response) {
                throw new common_1.HttpException(messages_constants_1.Messages.location.findOneFailure(locationId), common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: messages_constants_1.Messages.location.findOneSuccess(locationId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[LocationController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.location.findOneFailure(locationId), common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, location) {
        const locationId = parseInt(id, 10);
        try {
            const response = await this.locationService.update(locationId, location);
            return {
                success: true,
                message: messages_constants_1.Messages.location.updateSuccess(locationId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[LocationController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.location.updateFailure(locationId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        const locationId = parseInt(id, 10);
        try {
            await this.locationService.remove(locationId);
            return {
                success: true,
                message: messages_constants_1.Messages.location.removeSuccess(locationId),
            };
        }
        catch (error) {
            this.logger.error(`[LocationController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.location.removeFailure(locationId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.LocationController = LocationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_entity_1.Location]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, location_entity_1.Location]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "remove", null);
exports.LocationController = LocationController = LocationController_1 = __decorate([
    (0, common_1.Controller)('location'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
//# sourceMappingURL=location.controller.js.map