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
var GoogleDriveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const fs = require("fs");
const path = require("path");
const google_auth_service_1 = require("../google-auth/google-auth.service");
const auth_token_service_1 = require("../auth-token/auth-token.service");
let GoogleDriveService = GoogleDriveService_1 = class GoogleDriveService {
    constructor(configService, googleAuthService, authTokenService) {
        this.configService = configService;
        this.googleAuthService = googleAuthService;
        this.authTokenService = authTokenService;
        this.logger = new common_1.Logger(GoogleDriveService_1.name);
    }
    async onModuleInit() {
        await this.setDriveCredentials();
    }
    async setDriveCredentials() {
        this.oAuth2Client = await this.googleAuthService.getOAuth2Client();
        const credentials = await this.authTokenService.getTokens();
        await this.oAuth2Client.setCredentials({
            access_token: credentials.accessToken,
            refresh_token: credentials.refreshToken,
        });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth: this.oAuth2Client });
    }
    async ensureAuthenticated() {
        const tokenInfo = await this.oAuth2Client.getAccessToken();
        if (!tokenInfo.token) {
            this.logger.warn('Access token is missing or expired. Attempting to refresh.');
            this.resetAccessToken();
        }
    }
    async resetAccessToken() {
        const newTokens = await this.googleAuthService.refreshAccessToken();
        await this.oAuth2Client.setCredentials(newTokens);
        await this.setDriveCredentials();
    }
    async uploadFile(filePath, folderId) {
        try {
            await this.ensureAuthenticated();
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }
            const fileMetadata = {
                name: path.basename(filePath),
                parents: [folderId],
            };
            const media = {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(filePath),
            };
            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, name',
            });
            this.logger.log(`File uploaded successfully: ${response.data.name}`);
            const fileId = response.data.id;
            this.logger.log(`File uploaded successfully: ${fileId}`);
            await this.drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            const publicUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
            return { id: fileId, url: publicUrl };
        }
        catch (error) {
            this.logger.error(`Error uploading file: ${error.message}`);
            throw error;
        }
    }
    async createFolder(folderName, parentFolderId) {
        try {
            await this.ensureAuthenticated();
            const fileMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: parentFolderId ? [parentFolderId] : [],
            };
            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                fields: 'id',
            });
            this.logger.log(`Folder created successfully: ${folderName}`);
            return response.data.id;
        }
        catch (error) {
            this.logger.error(`Error creating folder: ${error.message}`);
            throw error;
        }
    }
    async getOrCreateFolder(folderName, parentFolderId) {
        try {
            await this.ensureAuthenticated();
            const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId}' in parents`;
            const response = await this.drive.files.list({
                q: query,
                fields: 'files(id, name)',
            });
            if (response.data.files && response.data.files.length > 0) {
                this.logger.log(`Folder already exists: ${folderName}`);
                return response.data.files[0].id;
            }
            this.logger.log(`Folder not found. Creating new folder: ${folderName}`);
            return this.createFolder(folderName, parentFolderId);
        }
        catch (error) {
            this.logger.error(`Error getting or creating folder: ${error.message}`);
            throw error;
        }
    }
};
exports.GoogleDriveService = GoogleDriveService;
exports.GoogleDriveService = GoogleDriveService = GoogleDriveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, google_auth_service_1.GoogleAuthService, auth_token_service_1.AuthTokenService])
], GoogleDriveService);
//# sourceMappingURL=google-drive.service.js.map