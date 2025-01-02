"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../modules/user/user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../modules/user/entities/user.entity");
let JwtAuthModule = class JwtAuthModule {
};
exports.JwtAuthModule = JwtAuthModule;
exports.JwtAuthModule = JwtAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET_KEY'),
                    signOptions: { expiresIn: '2d' },
                }),
            }),
        ],
        providers: [
            jwt_auth_guard_1.JwtAuthGuard,
            user_service_1.UserService,
        ],
        exports: [
            jwt_auth_guard_1.JwtAuthGuard,
            jwt_1.JwtModule,
        ],
    })
], JwtAuthModule);
//# sourceMappingURL=jwt-auth.module.js.map