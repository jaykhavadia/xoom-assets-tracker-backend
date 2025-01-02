"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("./transaction.service");
const transaction_controller_1 = require("./transaction.controller");
const common_module_1 = require("../../common/common.module");
const typeorm_1 = require("@nestjs/typeorm");
const vehical_entity_1 = require("../vehicle/entities/vehical.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const employee_entity_1 = require("../employee/entities/employee.entity");
const location_entity_1 = require("../location/entities/location.entity");
const vehicle_module_1 = require("../vehicle/vehicle.module");
const employee_module_1 = require("../employee/employee.module");
const location_module_1 = require("../location/location.module");
const jwt_auth_module_1 = require("../../auth/jwt-auth.module");
const user_entity_1 = require("../user/entities/user.entity");
const aggregator_entity_1 = require("../aggregator/entities/aggregator.entity");
const aggregator_module_1 = require("../aggregator/aggregator.module");
const sheet_module_1 = require("../sheet/sheet.module");
let TransactionModule = class TransactionModule {
};
exports.TransactionModule = TransactionModule;
exports.TransactionModule = TransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vehical_entity_1.Vehicle, transaction_entity_1.Transaction, employee_entity_1.Employee, location_entity_1.Location, user_entity_1.User, aggregator_entity_1.Aggregator]), common_module_1.CommonModule, vehicle_module_1.VehicleModule, employee_module_1.EmployeeModule, location_module_1.LocationModule, jwt_auth_module_1.JwtAuthModule, aggregator_module_1.AggregatorModule, sheet_module_1.SheetModule],
        controllers: [transaction_controller_1.TransactionController],
        providers: [transaction_service_1.TransactionService],
    })
], TransactionModule);
//# sourceMappingURL=transaction.module.js.map