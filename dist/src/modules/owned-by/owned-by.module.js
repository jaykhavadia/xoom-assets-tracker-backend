"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnedByModule = void 0;
const common_1 = require("@nestjs/common");
const owned_by_service_1 = require("./owned-by.service");
const owned_by_controller_1 = require("./owned-by.controller");
const owned_by_entity_1 = require("./entities/owned_by.entity");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_auth_module_1 = require("../../auth/jwt-auth.module");
const user_entity_1 = require("../user/entities/user.entity");
let OwnedByModule = class OwnedByModule {
};
exports.OwnedByModule = OwnedByModule;
exports.OwnedByModule = OwnedByModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([owned_by_entity_1.OwnedBy, user_entity_1.User]), jwt_auth_module_1.JwtAuthModule],
        controllers: [owned_by_controller_1.OwnedByController],
        providers: [owned_by_service_1.OwnedByService],
    })
], OwnedByModule);
//# sourceMappingURL=owned-by.module.js.map