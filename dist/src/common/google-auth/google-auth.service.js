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
var GoogleAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
const google_config_1 = require("../../../google.config");
const auth_token_service_1 = require("../auth-token/auth-token.service");
let GoogleAuthService = GoogleAuthService_1 = class GoogleAuthService {
    constructor(configService, authTokenService) {
        this.configService = configService;
        this.authTokenService = authTokenService;
        this.logger = new common_1.Logger(GoogleAuthService_1.name);
        const { clientId, clientSecret, redirectUri } = (0, google_config_1.googleConfig)(this.configService);
        this.oAuth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
    }
    generateAuthUrl() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive.file'],
            prompt: 'consent',
        });
        this.logger.log('Generated authorization URL: ' + authUrl);
        return authUrl;
    }
    async getTokens(code) {
        try {
            const { tokens } = await this.oAuth2Client.getToken(code);
            this.oAuth2Client.setCredentials(tokens);
            this.logger.log('Tokens obtained successfully');
            return tokens;
        }
        catch (error) {
            this.logger.error('Error exchanging code for tokens: ' + error.message);
            throw error;
        }
    }
    setCredentials(accessToken, refreshToken) {
        this.oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        this.logger.log('OAuth2 client credentials set');
    }
    async refreshAccessToken() {
        try {
            const tokens = await this.oAuth2Client.getAccessToken();
            console.log("🚀 ~ GoogleAuthService ~ refreshAccessToken ~ tokens:", tokens);
            if (tokens?.token) {
                const expirationTime = Date.now() + 3600 * 1000;
                await this.authTokenService.saveTokens(tokens.token, this.oAuth2Client.credentials.refresh_token, expirationTime);
                this.logger.log('Access token refreshed and saved successfully');
            }
        }
        catch (error) {
            this.logger.error('Error refreshing access token: ' + error.message);
            throw error;
        }
    }
    getOAuth2Client() {
        return this.oAuth2Client;
    }
};
exports.GoogleAuthService = GoogleAuthService;
exports.GoogleAuthService = GoogleAuthService = GoogleAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, auth_token_service_1.AuthTokenService])
], GoogleAuthService);
//# sourceMappingURL=google-auth.service.js.map