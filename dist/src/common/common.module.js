"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const upload_service_1 = require("./upload/upload.service");
const files_helper_service_1 = require("./files-helper/files-helper.service");
const google_auth_service_1 = require("./google-auth/google-auth.service");
const google_drive_service_1 = require("./google-drive/google-drive.service");
const typeorm_1 = require("@nestjs/typeorm");
const auth_token_entity_1 = require("./auth-token/auth-token.entity");
const auth_token_service_1 = require("./auth-token/auth-token.service");
const vehicle_type_entity_1 = require("../modules/vehicle-type/entities/vehicle-type.entity");
const model_entity_1 = require("../modules/model/entities/model.entity");
const owned_by_entity_1 = require("../modules/owned-by/entities/owned_by.entity");
const aggregator_entity_1 = require("../modules/aggregator/entities/aggregator.entity");
const vehical_entity_1 = require("../modules/vehicle/entities/vehical.entity");
const employee_entity_1 = require("../modules/employee/entities/employee.entity");
const location_entity_1 = require("../modules/location/entities/location.entity");
const transaction_entity_1 = require("../modules/transaction/entities/transaction.entity");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([auth_token_entity_1.AuthToken, vehicle_type_entity_1.VehicleType, model_entity_1.Model, owned_by_entity_1.OwnedBy, aggregator_entity_1.Aggregator, vehical_entity_1.Vehicle, employee_entity_1.Employee, location_entity_1.Location, transaction_entity_1.Transaction])],
        providers: [upload_service_1.UploadService, files_helper_service_1.FilesHelperService, google_auth_service_1.GoogleAuthService, google_drive_service_1.GoogleDriveService, auth_token_service_1.AuthTokenService],
        exports: [upload_service_1.UploadService, google_drive_service_1.GoogleDriveService, files_helper_service_1.FilesHelperService, auth_token_service_1.AuthTokenService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map