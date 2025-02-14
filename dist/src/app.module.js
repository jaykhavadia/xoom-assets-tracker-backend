"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const employee_module_1 = require("./modules/employee/employee.module");
const location_module_1 = require("./modules/location/location.module");
const transaction_module_1 = require("./modules/transaction/transaction.module");
const vehicle_module_1 = require("./modules/vehicle/vehicle.module");
const vehical_entity_1 = require("./modules/vehicle/entities/vehical.entity");
const location_entity_1 = require("./modules/location/entities/location.entity");
const employee_entity_1 = require("./modules/employee/entities/employee.entity");
const transaction_entity_1 = require("./modules/transaction/entities/transaction.entity");
const common_module_1 = require("./common/common.module");
const sheet_module_1 = require("./modules/sheet/sheet.module");
const sheet_entity_1 = require("./modules/sheet/entities/sheet.entity");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const schedule_1 = require("@nestjs/schedule");
const cronservice_1 = require("./cronservice");
const auth_token_entity_1 = require("./common/auth-token/auth-token.entity");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_entity_1 = require("./modules/user/entities/user.entity");
const vehicle_type_module_1 = require("./modules/vehicle-type/vehicle-type.module");
const aggregator_module_1 = require("./modules/aggregator/aggregator.module");
const model_module_1 = require("./modules/model/model.module");
const owned_by_module_1 = require("./modules/owned-by/owned-by.module");
const aggregator_entity_1 = require("./modules/aggregator/entities/aggregator.entity");
const owned_by_entity_1 = require("./modules/owned-by/entities/owned_by.entity");
const model_entity_1 = require("./modules/model/entities/model.entity");
const vehicle_type_entity_1 = require("./modules/vehicle-type/entities/vehicle-type.entity");
const jwt_auth_module_1 = require("./auth/jwt-auth.module");
const backup_module_1 = require("./modules/backup/backup.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "..", "public"),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: async () => ({
                    type: "mysql",
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: [
                        vehical_entity_1.Vehicle,
                        location_entity_1.Location,
                        employee_entity_1.Employee,
                        transaction_entity_1.Transaction,
                        sheet_entity_1.Sheet,
                        auth_token_entity_1.AuthToken,
                        user_entity_1.User,
                        vehicle_type_entity_1.VehicleType,
                        model_entity_1.Model,
                        owned_by_entity_1.OwnedBy,
                        aggregator_entity_1.Aggregator,
                    ],
                    synchronize: true,
                }),
                async dataSourceFactory(options) {
                    const dataSource = await new typeorm_2.DataSource(options).initialize();
                    console.log("Successfully connected to the database!", dataSource.options);
                    return dataSource;
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            vehicle_module_1.VehicleModule,
            employee_module_1.EmployeeModule,
            location_module_1.LocationModule,
            transaction_module_1.TransactionModule,
            common_module_1.CommonModule,
            sheet_module_1.SheetModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            vehicle_type_module_1.VehicleTypeModule,
            aggregator_module_1.AggregatorModule,
            model_module_1.ModelModule,
            owned_by_module_1.OwnedByModule,
            jwt_auth_module_1.JwtAuthModule,
            backup_module_1.BackupModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, cronservice_1.CronService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map