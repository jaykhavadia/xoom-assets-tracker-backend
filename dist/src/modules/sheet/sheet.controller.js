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
var SheetController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetController = void 0;
const common_1 = require("@nestjs/common");
const sheet_service_1 = require("./sheet.service");
const sheet_entity_1 = require("./entities/sheet.entity");
const messages_constants_1 = require("../../constants/messages.constants");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let SheetController = SheetController_1 = class SheetController {
    constructor(sheetService) {
        this.sheetService = sheetService;
        this.logger = new common_1.Logger(SheetController_1.name);
    }
    async create(sheet) {
        try {
            const response = await this.sheetService.create(sheet);
            return {
                success: true,
                message: messages_constants_1.Messages.sheet.createSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[SheetController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.sheet.createFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const response = await this.sheetService.findAll();
            return {
                success: true,
                message: messages_constants_1.Messages.sheet.findAllSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[SheetController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.sheet.findAllFailure, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        const sheetId = parseInt(id, 10);
        try {
            const response = await this.sheetService.findOne(sheetId);
            if (!response) {
                throw new common_1.HttpException(messages_constants_1.Messages.sheet.findOneFailure(sheetId), common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: messages_constants_1.Messages.sheet.findOneSuccess(sheetId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[SheetController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.sheet.findOneFailure(sheetId), common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, sheet) {
        const sheetId = parseInt(id, 10);
        try {
            const response = await this.sheetService.update(sheetId, sheet);
            return {
                success: true,
                message: messages_constants_1.Messages.sheet.updateSuccess(sheetId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[SheetController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.sheet.updateFailure(sheetId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        const sheetId = parseInt(id, 10);
        try {
            await this.sheetService.remove(sheetId);
            return {
                success: true,
                message: messages_constants_1.Messages.sheet.removeSuccess(sheetId),
            };
        }
        catch (error) {
            this.logger.error(`[SheetController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.sheet.removeFailure(sheetId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.SheetController = SheetController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sheet_entity_1.Sheet]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sheet_entity_1.Sheet]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SheetController.prototype, "remove", null);
exports.SheetController = SheetController = SheetController_1 = __decorate([
    (0, common_1.Controller)('sheet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sheet_service_1.SheetService])
], SheetController);
//# sourceMappingURL=sheet.controller.js.map