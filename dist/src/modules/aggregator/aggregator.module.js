"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorModule = void 0;
const common_1 = require("@nestjs/common");
const aggregator_service_1 = require("./aggregator.service");
const aggregator_controller_1 = require("./aggregator.controller");
const aggregator_entity_1 = require("./entities/aggregator.entity");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_auth_module_1 = require("../../auth/jwt-auth.module");
const user_entity_1 = require("../user/entities/user.entity");
let AggregatorModule = class AggregatorModule {
};
exports.AggregatorModule = AggregatorModule;
exports.AggregatorModule = AggregatorModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([aggregator_entity_1.Aggregator, user_entity_1.User]), jwt_auth_module_1.JwtAuthModule],
        controllers: [aggregator_controller_1.AggregatorController],
        providers: [aggregator_service_1.AggregatorService],
        exports: [aggregator_service_1.AggregatorService]
    })
], AggregatorModule);
//# sourceMappingURL=aggregator.module.js.map