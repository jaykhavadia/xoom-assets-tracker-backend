"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleConfig = void 0;
const googleConfig = (configService) => ({
    clientId: configService.get('GOOGLE_CLIENT_ID'),
    clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
    redirectUri: configService.get('GOOGLE_REDIRECT_URI'),
});
exports.googleConfig = googleConfig;
//# sourceMappingURL=google.config.js.map