"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_service_1 = require("./vehicle.service");
const vehicle_controller_1 = require("./vehicle.controller");
const common_module_1 = require("../../common/common.module");
const typeorm_1 = require("@nestjs/typeorm");
const vehical_entity_1 = require("./entities/vehical.entity");
const sheet_service_1 = require("../sheet/sheet.service");
const sheet_module_1 = require("../sheet/sheet.module");
const sheet_entity_1 = require("../sheet/entities/sheet.entity");
const vehicle_type_entity_1 = require("../vehicle-type/entities/vehicle-type.entity");
const model_entity_1 = require("../model/entities/model.entity");
const owned_by_entity_1 = require("../owned-by/entities/owned_by.entity");
const aggregator_entity_1 = require("../aggregator/entities/aggregator.entity");
const jwt_auth_module_1 = require("../../auth/jwt-auth.module");
const user_entity_1 = require("../user/entities/user.entity");
let VehicleModule = class VehicleModule {
};
exports.VehicleModule = VehicleModule;
exports.VehicleModule = VehicleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vehical_entity_1.Vehicle, sheet_entity_1.Sheet, vehicle_type_entity_1.VehicleType, model_entity_1.Model, owned_by_entity_1.OwnedBy, aggregator_entity_1.Aggregator, user_entity_1.User]), common_module_1.CommonModule, sheet_module_1.SheetModule, jwt_auth_module_1.JwtAuthModule],
        controllers: [vehicle_controller_1.VehicleController],
        providers: [vehicle_service_1.VehicleService, sheet_service_1.SheetService],
        exports: [vehicle_service_1.VehicleService]
    })
], VehicleModule);
//# sourceMappingURL=vehicle.module.js.map