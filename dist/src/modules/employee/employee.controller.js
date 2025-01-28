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
var EmployeeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const platform_express_1 = require("@nestjs/platform-express");
const employee_entity_1 = require("./entities/employee.entity");
const upload_service_1 = require("../../common/upload/upload.service");
const messages_constants_1 = require("../../constants/messages.constants");
const date_fns_1 = require("date-fns");
const sheet_service_1 = require("../sheet/sheet.service");
const google_drive_service_1 = require("../../common/google-drive/google-drive.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let EmployeeController = EmployeeController_1 = class EmployeeController {
    constructor(employeeService, uploadService, sheetService, googleDriveService) {
        this.employeeService = employeeService;
        this.uploadService = uploadService;
        this.sheetService = sheetService;
        this.googleDriveService = googleDriveService;
        this.logger = new common_1.Logger(EmployeeController_1.name);
    }
    async create(employee) {
        try {
            const response = await this.employeeService.create(employee);
            return {
                success: true,
                message: messages_constants_1.Messages.employee.createSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.employee.createFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const response = await this.employeeService.findAll();
            return {
                success: true,
                message: messages_constants_1.Messages.employee.findAllSuccess,
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.employee.findAllFailure, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        const employeeId = parseInt(id, 10);
        try {
            const response = await this.employeeService.findOne(employeeId);
            if (!response) {
                throw new common_1.HttpException(messages_constants_1.Messages.employee.findOneFailure(employeeId), common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: messages_constants_1.Messages.employee.findOneSuccess(employeeId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.employee.findOneFailure(employeeId), common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, employee) {
        const employeeId = parseInt(id, 10);
        try {
            const response = await this.employeeService.update(employeeId, employee);
            return {
                success: true,
                message: messages_constants_1.Messages.employee.updateSuccess(employeeId),
                data: response,
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.employee.updateFailure(employeeId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        const employeeId = parseInt(id, 10);
        try {
            await this.employeeService.remove(employeeId);
            return {
                success: true,
                message: messages_constants_1.Messages.employee.removeSuccess(employeeId),
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.employee.removeFailure(employeeId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadExcel(file) {
        try {
            const fileResponse = await this.uploadService.readExcel(file, 'employee');
            if ('employees' in fileResponse) {
                await this.employeeService.updateEmployees(fileResponse.employees.filter((item) => item !== undefined));
            }
            else {
                throw new Error('Unexpected file response type for employees.');
            }
            const sheetData = {
                uploadedAt: new Date(),
                uploadedAtTime: (0, date_fns_1.format)(new Date(), 'hh:mm a'),
                fileUrl: file.originalname,
                type: 'Employee',
            };
            const sheetDetails = await this.sheetService.create(sheetData);
            return {
                success: true,
                message: messages_constants_1.Messages.employee.updateBulkSuccess,
                errorArray: fileResponse.errorArray
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [uploadExcel] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_entity_1.Employee]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_entity_1.Employee]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "uploadExcel", null);
exports.EmployeeController = EmployeeController = EmployeeController_1 = __decorate([
    (0, common_1.Controller)('employee'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService,
        upload_service_1.UploadService,
        sheet_service_1.SheetService,
        google_drive_service_1.GoogleDriveService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map