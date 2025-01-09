"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const employee_controller_1 = require("./employee.controller");
const common_module_1 = require("../../common/common.module");
const employee_entity_1 = require("./entities/employee.entity");
const typeorm_1 = require("@nestjs/typeorm");
const sheet_module_1 = require("../sheet/sheet.module");
const sheet_service_1 = require("../sheet/sheet.service");
const sheet_entity_1 = require("../sheet/entities/sheet.entity");
const jwt_auth_module_1 = require("../../auth/jwt-auth.module");
const user_entity_1 = require("../user/entities/user.entity");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee, sheet_entity_1.Sheet, user_entity_1.User]), common_module_1.CommonModule, sheet_module_1.SheetModule, jwt_auth_module_1.JwtAuthModule],
        controllers: [employee_controller_1.EmployeeController],
        providers: [employee_service_1.EmployeeService, sheet_service_1.SheetService],
        exports: [employee_service_1.EmployeeService]
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map