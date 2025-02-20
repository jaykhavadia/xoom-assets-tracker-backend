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
var AuthTokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_token_entity_1 = require("./auth-token.entity");
const config_1 = require("@nestjs/config");
let AuthTokenService = AuthTokenService_1 = class AuthTokenService {
    constructor(authTokenRepository, configService) {
        this.authTokenRepository = authTokenRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthTokenService_1.name);
    }
    async getTokens() {
        try {
            let token = await this.authTokenRepository.findOne({ where: { id: 1 } });
            if (!token) {
                this.logger.warn('No tokens found in the database.');
                token = await this.saveTokens(this.configService.get('GOOGLE_ACCESS_TOKEN'), this.configService.get('GOOGLE_REFRESH_TOKEN'), 3400);
            }
            return token;
        }
        catch (error) {
            this.logger.error('Error fetching tokens from the database:', error);
            throw error;
        }
    }
    async saveTokens(accessToken, refreshToken, expiresAt) {
        try {
            let tokenRecord = await this.authTokenRepository.findOne({ where: { id: 1 } });
            if (tokenRecord) {
                tokenRecord.accessToken = accessToken;
                tokenRecord.refreshToken = refreshToken;
                tokenRecord.accessTokenExpiresAt = expiresAt;
            }
            else {
                tokenRecord = this.authTokenRepository.create({
                    accessToken,
                    refreshToken,
                    accessTokenExpiresAt: expiresAt,
                });
            }
            this.logger.log("🚀 ~ AuthTokenService ~ saveTokens ~ tokenRecord:", tokenRecord);
            this.logger.log('Tokens saved/updated successfully');
            return await this.authTokenRepository.save(tokenRecord);
        }
        catch (error) {
            this.logger.error('Error saving tokens to the database:', error);
            throw error;
        }
    }
    async refreshAccessToken(accessToken, refreshToken, expiresAt) {
        await this.saveTokens(accessToken, refreshToken, expiresAt);
    }
};
exports.AuthTokenService = AuthTokenService;
exports.AuthTokenService = AuthTokenService = AuthTokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_token_entity_1.AuthToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], AuthTokenService);
//# sourceMappingURL=auth-token.service.js.map