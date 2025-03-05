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
var TransactionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("./transaction.service");
const platform_express_1 = require("@nestjs/platform-express");
const transaction_entity_1 = require("./entities/transaction.entity");
const files_helper_service_1 = require("../../common/files-helper/files-helper.service");
const messages_constants_1 = require("../../constants/messages.constants");
const CreateTransaction_dto_1 = require("./dto/CreateTransaction.dto");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const upload_service_1 = require("../../common/upload/upload.service");
const date_fns_1 = require("date-fns");
const sheet_service_1 = require("../sheet/sheet.service");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const google_drive_service_1 = require("../../common/google-drive/google-drive.service");
let TransactionController = TransactionController_1 = class TransactionController {
    constructor(transactionService, uploadService, sheetService, filesHelperService, googleDriveService) {
        this.transactionService = transactionService;
        this.uploadService = uploadService;
        this.sheetService = sheetService;
        this.filesHelperService = filesHelperService;
        this.googleDriveService = googleDriveService;
        this.logger = new common_1.Logger(TransactionController_1.name);
    }
    async create(body, user, files) {
        try {
            let transaction = await this.transactionService.create({
                ...body,
                user,
            });
            try {
                if (files && Object.keys(files).length > 0) {
                    const savedFiles = await this.filesHelperService.saveTransactionFiles(files, transaction.id);
                    transaction = await this.transactionService.updateTransaction(transaction.id, { ...transaction, pictures: savedFiles });
                }
                this.logger.log(messages_constants_1.Messages.transaction.createSuccess);
            }
            catch (error) {
                console.error("TransactionController Create ~ error:", error);
                this.googleDriveService.ensureAuthenticated();
                throw new common_1.HttpException("Image Upload Issue", common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                success: true,
                message: messages_constants_1.Messages.transaction.createSuccess,
                data: transaction,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [create] Error: ${error.message}`);
            throw new common_1.HttpException(error.message === "Image Upload Issue"
                ? "Transaction is been Created but Image Upload Access Revoked"
                : error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, user, body) {
        try {
            const updatedTransaction = await this.transactionService.update(Number(id), { ...body, user });
            return {
                success: true,
                message: messages_constants_1.Messages.transaction.updateSuccess(Number(id)),
                data: updatedTransaction,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [update] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const transactions = await this.transactionService.findAll();
            this.logger.log(messages_constants_1.Messages.transaction.findAllSuccess);
            return {
                success: true,
                message: messages_constants_1.Messages.transaction.findAllSuccess,
                data: transactions,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [findAll] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.transaction.findAllFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findPastTransaction(vehicleNo, action) {
        const vehicleNumber = parseInt(vehicleNo, 10);
        try {
            const transaction = await this.transactionService.findPastTransaction(vehicleNumber, action);
            return {
                success: true,
                message: messages_constants_1.Messages.transaction.findPastTransactionSuccess(vehicleNumber),
                data: transaction,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [findPastTransaction] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        const transactionId = parseInt(id, 10);
        try {
            await this.transactionService.remove(transactionId);
            this.logger.log(messages_constants_1.Messages.transaction.removeSuccess(transactionId));
            return {
                success: true,
                message: messages_constants_1.Messages.transaction.removeSuccess(transactionId),
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [remove] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.transaction.removeFailure(transactionId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTransactionsByDate(from, to, months, date) {
        try {
            const transactions = await this.transactionService.getTransactionsByDateRange(from, to, months, date);
            return {
                success: true,
                message: "Transactions fetched successfully.",
                data: transactions,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [getTransactionsByDate] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to fetch transactions.", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadExcel(file) {
        try {
            const errorArray = await this.transactionService.processTransaction(file, "transaction");
            const sheetData = {
                uploadedAt: new Date(),
                uploadedAtTime: (0, date_fns_1.format)(new Date(), "hh:mm a"),
                fileUrl: file.originalname,
                type: "Transaction",
            };
            const sheetDetails = await this.sheetService.create(sheetData);
            return {
                success: true,
                message: messages_constants_1.Messages.employee.updateBulkSuccess,
                errorArray,
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [uploadExcel] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadFineExcel(file) {
        try {
            const fileResponse = await this.uploadService.readExcel(file, "fine");
            if ("fine" in fileResponse) {
                const filteredTransaction = fileResponse.fine.filter((item) => item !== undefined);
            }
            else {
                throw new Error("Unexpected file response type for transaction.");
            }
            return {
                success: true,
                message: "Fine Allocated",
                data: fileResponse.fine,
                errorArray: fileResponse.errorArray,
            };
        }
        catch (error) {
            this.logger.error(`[EmployeeController] [uploadExcel] Error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        const transactionId = parseInt(id, 10);
        try {
            const transaction = await this.transactionService.findOne(transactionId);
            this.logger.log(messages_constants_1.Messages.transaction.findOneSuccess(transactionId));
            return {
                success: true,
                message: messages_constants_1.Messages.transaction.findOneSuccess(transactionId),
                data: transaction,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionController] [findOne] Error: ${error.message}`);
            throw new common_1.HttpException(messages_constants_1.Messages.transaction.findOneFailure(transactionId), common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "vehiclePictures[back]", maxCount: 1 },
        { name: "vehiclePictures[front]", maxCount: 1 },
        { name: "vehiclePictures[left]", maxCount: 1 },
        { name: "vehiclePictures[right]", maxCount: 1 },
    ])),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTransaction_dto_1.CreateTransactionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreateTransaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("past-transaction/:vehicleNo/:action"),
    __param(0, (0, common_1.Param)("vehicleNo")),
    __param(1, (0, common_1.Param)("action")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "findPastTransaction", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("filter"),
    __param(0, (0, common_1.Query)("from")),
    __param(1, (0, common_1.Query)("to")),
    __param(2, (0, common_1.Query)("months")),
    __param(3, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionsByDate", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "uploadExcel", null);
__decorate([
    (0, common_1.Post)("upload-fine"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "uploadFineExcel", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "findOne", null);
exports.TransactionController = TransactionController = TransactionController_1 = __decorate([
    (0, common_1.Controller)("transaction"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        upload_service_1.UploadService,
        sheet_service_1.SheetService,
        files_helper_service_1.FilesHelperService,
        google_drive_service_1.GoogleDriveService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map