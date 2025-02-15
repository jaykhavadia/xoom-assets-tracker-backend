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
var VehicleController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_service_1 = require("./vehicle.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("../../common/upload/upload.service");
const messages_constants_1 = require("../../constants/messages.constants");
const sheet_service_1 = require("../sheet/sheet.service");
const date_fns_1 = require("date-fns");
const google_drive_service_1 = require("../../common/google-drive/google-drive.service");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const vehicleQuery_service_1 = require("./vehicleQuery.service");
let VehicleController = VehicleController_1 = class VehicleController {
    constructor(vehicleService, vehicleQueryService, uploadService, sheetService, googleDriveService) {
        this.vehicleService = vehicleService;
        this.vehicleQueryService = vehicleQueryService;
        this.uploadService = uploadService;
        this.sheetService = sheetService;
        this.googleDriveService = googleDriveService;
        this.logger = new common_1.Logger(VehicleController_1.name);
    }
    async create(vehicle) {
        try {
            const response = await this.vehicleService.create(vehicle);
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.createSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(status) {
        if (status && status !== "available" && status !== "occupied") {
            throw new common_1.HttpException(messages_constants_1.Messages.vehicle.invalidStatus, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.vehicleService.findAll(status);
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.findAllSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.vehicle.findAllFailure, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, vehicle) {
        const vehicleId = id;
        try {
            const response = await this.vehicleService.update(vehicleId, vehicle);
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.updateSuccess(vehicleId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        const vehicleId = id;
        try {
            await this.vehicleService.remove(vehicleId);
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.removeSuccess(vehicleId),
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.vehicle.removeFailure(vehicleId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadExcel(file) {
        try {
            const fileResponse = await this.uploadService.readExcel(file, "vehicle");
            if ("vehicles" in fileResponse) {
                await this.vehicleService.updateVehicles((await Promise.all(fileResponse.vehicles.filter((item) => item !== undefined))));
            }
            else {
                throw new Error("Unexpected file response type for vehicles.");
            }
            const sheetData = {
                uploadedAt: new Date(),
                uploadedAtTime: (0, date_fns_1.format)(new Date(), "hh:mm a"),
                fileUrl: file.originalname,
                type: "Vehicle",
            };
            const sheetDetails = await this.sheetService.create(sheetData);
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.updateBulkSuccess,
                errorArray: fileResponse.errorArray,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [uploadExcel] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.vehicle.updateBulkFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async bulkUpdate(file) {
        try {
            const fileResponse = await this.uploadService.readExcel(file, "activeInactive");
            if ("activeInactive" in fileResponse) {
                const updatedVehicles = (await Promise.all(fileResponse.activeInactive.filter((item) => item !== undefined)));
                await Promise.all(updatedVehicles.map(async (vehicle) => {
                    try {
                        await this.vehicleService.update(vehicle.id, vehicle);
                    }
                    catch (error) {
                        this.logger.error("[VehicleController] [bulkUpdate] error:", error);
                        fileResponse.errorArray.push(error.message);
                    }
                }));
            }
            else {
                throw new Error("Unexpected file response type for vehicles.");
            }
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.updateBulkSuccess,
                errorArray: fileResponse.errorArray,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [uploadExcel] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.vehicle.updateBulkFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getFilteredVehicles(model, ownedBy, vehicleType, aggregatorName) {
        try {
            const data = await this.vehicleService.getFilteredVehicles(model, ownedBy, vehicleType, aggregatorName);
            return {
                success: true,
                message: "Filtered vehicles fetched successfully.",
                data,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [getFilteredVehicles] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to fetch filtered vehicles.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVehicleCountByAggregator() {
        try {
            const data = await this.vehicleService.getVehicleCountByAggregator();
            return {
                success: true,
                message: "Vehicle count by aggregator fetched successfully.",
                data,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [getVehicleCountByAggregator] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to fetch vehicle count by aggregator.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVehicleCountByModel() {
        try {
            const data = await this.vehicleService.getVehicleCountByModel();
            return {
                success: true,
                message: "Vehicle count by model fetched successfully.",
                data,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [getVehicleCountByModel] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to fetch vehicle count by model.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVehicleCountByOwner() {
        try {
            const data = await this.vehicleService.getVehicleCountByOwner();
            return {
                success: true,
                message: "Vehicle count by owner fetched successfully.",
                data,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [getVehicleCountByOwner] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to fetch vehicle count by owner.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVehicleCountByVehicleType() {
        try {
            const data = await this.vehicleService.getVehicleCountByType();
            return {
                success: true,
                message: "Vehicle count by type fetched successfully.",
                data,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [getVehicleCountByType] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to fetch vehicle count by type.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVehiclesByLocationName(locationName) {
        try {
            const data = await this.vehicleService.getVehiclesByLocationName(locationName);
            return {
                success: true,
                message: `Vehicles fetched successfully for location: ${locationName || "all"}`,
                data,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [getVehiclesByLocationName] Error: ${error.message}`);
            throw new common_1.HttpException(error.message || "Failed to fetch vehicles by location name", error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVehicleCountByModelAndAggregator() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByModelAndAggregator();
            return {
                success: true,
                message: "Vehicle count retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            this.logger.error("[VehicleController] [getVehicleCountByModelAndAggregator] ~ error:", error);
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count");
        }
    }
    async getVehicleCountByAggregatorAndModel() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByAggregatorAndModel();
            return {
                success: true,
                message: "Vehicle count by aggregator and model retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count by aggregator and model");
        }
    }
    async getVehicleCountByOwnerAndAggregator() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByOwnerAndAggregator();
            return {
                success: true,
                message: "Vehicle count by owner and aggregator retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count by owner and aggregator");
        }
    }
    async getVehicleCountByAggregatorAndCategory() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByAggregatorAndCategory();
            return {
                success: true,
                message: "Vehicle count by aggregator and category retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count by aggregator and category");
        }
    }
    async getVehicleCountByAggregatorEmiratesAndCategory() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByAggregatorEmiratesAndCategory();
            return {
                success: true,
                message: "Vehicle count by aggregator, emirates, and category retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count by aggregator, emirates, and category");
        }
    }
    async getVehicleCountByEmiratesAndCategoryFuel() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByEmiratesAndCategory();
            return {
                success: true,
                message: "Vehicle count by emirates, category, and fuel retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count by emirates, category, and fuel");
        }
    }
    async getVehicleCountByEmiratesAndOwnedBy() {
        try {
            const result = await this.vehicleQueryService.findVehicleCountByEmiratesAndOwnedBy();
            return {
                success: true,
                message: "Vehicle count by emirates and owned by company retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicle count by emirates and owned by company");
        }
    }
    async getCategoryOperationByEmirates() {
        try {
            const result = await this.vehicleQueryService.findCategoryOperationByEmirates();
            return {
                success: true,
                message: "Category operation by emirates retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve category operation by emirates");
        }
    }
    async getEmiratesCategoryCount() {
        try {
            const result = await this.vehicleQueryService.findEmiratesCategoryCount();
            return {
                success: true,
                message: "Emirates category count retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve emirates category count");
        }
    }
    async getExpiryStatus() {
        try {
            const result = await this.vehicleQueryService.findExpiryStatus();
            return {
                success: true,
                message: "Expiry status retrieved successfully",
                data: result,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Failed to retrieve expiry status");
        }
    }
    async findOne(id) {
        const vehicleId = id;
        try {
            const response = await this.vehicleService.findOne(vehicleId);
            if (!response) {
                throw new common_1.HttpException(messages_constants_1.Messages.vehicle.findOneFailure(vehicleId), common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: messages_constants_1.Messages.vehicle.findOneSuccess(vehicleId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[VehicleController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.vehicle.findOneFailure(vehicleId), common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.VehicleController = VehicleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.VehicleDto]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vehicle_dto_1.VehicleDto]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "uploadExcel", null);
__decorate([
    (0, common_1.Post)("active-inactive"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Get)("filtered"),
    __param(0, (0, common_1.Query)("model")),
    __param(1, (0, common_1.Query)("ownedBy")),
    __param(2, (0, common_1.Query)("vehicleType")),
    __param(3, (0, common_1.Query)("aggregator")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getFilteredVehicles", null);
__decorate([
    (0, common_1.Get)("aggregator-count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByAggregator", null);
__decorate([
    (0, common_1.Get)("model-count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByModel", null);
__decorate([
    (0, common_1.Get)("owner-count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByOwner", null);
__decorate([
    (0, common_1.Get)("vehicle-type-count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByVehicleType", null);
__decorate([
    (0, common_1.Get)("by-location"),
    __param(0, (0, common_1.Query)("locationName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehiclesByLocationName", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-model-aggregator"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByModelAndAggregator", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-aggregator-model"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByAggregatorAndModel", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-owner-aggregator"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByOwnerAndAggregator", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-aggregator-category"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByAggregatorAndCategory", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-aggregator-emirates-category"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByAggregatorEmiratesAndCategory", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-emirates-category-fuel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByEmiratesAndCategoryFuel", null);
__decorate([
    (0, common_1.Get)("vehicle-count-by-emirates-owned-by"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicleCountByEmiratesAndOwnedBy", null);
__decorate([
    (0, common_1.Get)("category-operation-by-emirates"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getCategoryOperationByEmirates", null);
__decorate([
    (0, common_1.Get)("emirates-category-count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getEmiratesCategoryCount", null);
__decorate([
    (0, common_1.Get)("expiry-status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getExpiryStatus", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "findOne", null);
exports.VehicleController = VehicleController = VehicleController_1 = __decorate([
    (0, common_1.Controller)("vehicle"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vehicle_service_1.VehicleService,
        vehicleQuery_service_1.VehicleQueryService,
        upload_service_1.UploadService,
        sheet_service_1.SheetService,
        google_drive_service_1.GoogleDriveService])
], VehicleController);
//# sourceMappingURL=vehicle.controller.js.map