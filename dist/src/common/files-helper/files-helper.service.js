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
var FilesHelperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesHelperService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const path = require("path");
const google_drive_service_1 = require("../google-drive/google-drive.service");
let FilesHelperService = FilesHelperService_1 = class FilesHelperService {
    constructor(googleDriveService) {
        this.googleDriveService = googleDriveService;
        this.basePath = 'public/images';
        this.logger = new common_1.Logger(FilesHelperService_1.name);
        this.positions = ['back', 'front', 'left', 'right'];
        this.saveTransactionFiles = async (files, transactionId) => {
            try {
                const folderPath = path.join(process.cwd(), 'public', 'images', transactionId.toString());
                this.logger.log(`Folder path: ${folderPath}`);
                await fs.mkdir(folderPath, { recursive: true });
                const parentFolderId = '1BftHKWaW-2ZU-p0PrFP2YFapmWKlnnKP';
                const sheetFolderId = await this.googleDriveService.getOrCreateFolder(transactionId.toString(), parentFolderId);
                const savedFiles = await Promise.all(this.positions.map(async (position) => {
                    const file = files[`vehiclePictures[${position}]`] && files[`vehiclePictures[${position}]`][0];
                    if (file) {
                        const fileName = `${position}.png`;
                        const filePath = path.join(folderPath, fileName);
                        this.logger.log(`File path: ${filePath}`);
                        try {
                            await fs.writeFile(filePath, file.buffer);
                            this.logger.log(`File saved successfully at: ${filePath}`);
                            const savedFile = await this.googleDriveService.uploadFile(filePath, sheetFolderId);
                            return { [position]: { url: savedFile.url } };
                        }
                        catch (fileError) {
                            this.logger.warn(`[FilesHelper] Error writing file for position ${position}: ${fileError.message}`);
                            return { [position]: { url: null } };
                        }
                    }
                    else {
                        this.logger.warn(`No file provided for position ${position}`);
                        return { [position]: { url: null } };
                    }
                }));
                try {
                    await fs.rm(folderPath, { recursive: true, force: true });
                    this.logger.log('Temporary directory deleted successfully');
                }
                catch (error) {
                    this.logger.error('Error deleting directory:', error);
                }
                return savedFiles;
            }
            catch (error) {
                this.logger.error(`[FilesHelper] [saveTransactionFiles] Error: ${error.message}`);
                throw new Error('Failed to save transaction files');
            }
        };
    }
};
exports.FilesHelperService = FilesHelperService;
exports.FilesHelperService = FilesHelperService = FilesHelperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [google_drive_service_1.GoogleDriveService])
], FilesHelperService);
//# sourceMappingURL=files-helper.service.js.map