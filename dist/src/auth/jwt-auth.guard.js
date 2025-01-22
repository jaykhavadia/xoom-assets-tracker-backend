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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../modules/user/entities/user.entity");
const typeorm_2 = require("typeorm");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers["authorization"]?.split(" ")[1];
        if (!token) {
            throw new common_1.UnauthorizedException("No token provided");
        }
        try {
            const decoded = this.jwtService.verify(token);
            request["user"] = decoded;
            const user = await this.userRepository.findOne({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException("User not found");
            }
            switch (user.role) {
                case user_entity_1.Role.Owner:
                    return true;
                case user_entity_1.Role.Viewer:
                    if (request.method !== "GET") {
                        throw new common_1.ForbiddenException("Viewers can only view data.");
                    }
                    return true;
                case user_entity_1.Role.Editor:
                    const allowedModules = ["vehicles", "locations", "transaction"];
                    const routePath = request.baseUrl || request.url;
                    if (request.method !== "GET" &&
                        !allowedModules.some((path) => routePath.includes(path))) {
                        throw new common_1.ForbiddenException("Editors can only manage vehicles, locations & transaction.");
                    }
                    return true;
                default:
                    throw new common_1.ForbiddenException("Access denied");
            }
        }
        catch (error) {
            if (error.name === "JsonWebTokenError" ||
                error.name === "TokenExpiredError") {
                throw new common_1.UnauthorizedException(error.message);
            }
            throw new common_1.ForbiddenException(error.message);
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map