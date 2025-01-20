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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("axios");
const auth_token_service_1 = require("./common/auth-token/auth-token.service");
let CronService = class CronService {
    constructor(authTokenService) {
        this.authTokenService = authTokenService;
    }
    async refreshAccessToken() {
        const url = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams();
        params.append('client_id', process.env.GOOGLE_CLIENT_ID);
        params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        params.append('refresh_token', process.env.GOOGLE_REFRESH_TOKEN);
        params.append('grant_type', 'refresh_token');
        try {
            const response = await axios_1.default.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const { access_token, expires_in } = response.data;
            this.authTokenService.saveTokens(access_token, process.env.GOOGLE_REFRESH_TOKEN, expires_in);
            console.log('Access token refreshed successfully');
        }
        catch (error) {
            console.error('Error refreshing access token:', error.message);
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "refreshAccessToken", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_token_service_1.AuthTokenService])
], CronService);
//# sourceMappingURL=cronservice.js.map