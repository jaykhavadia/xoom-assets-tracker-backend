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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = exports.Emirates = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const transaction_entity_1 = require("../../transaction/entities/transaction.entity");
const vehicle_type_entity_1 = require("../../vehicle-type/entities/vehicle-type.entity");
const aggregator_entity_1 = require("../../aggregator/entities/aggregator.entity");
const owned_by_entity_1 = require("../../owned-by/entities/owned_by.entity");
const model_entity_1 = require("../../model/entities/model.entity");
const moment = require("moment");
var Emirates;
(function (Emirates) {
    Emirates["AbuDhabi"] = "AbuDhabi";
    Emirates["Dubai"] = "Dubai";
    Emirates["Sharjah"] = "Sharjah";
    Emirates["Ajman"] = "Ajman";
    Emirates["Fujairah"] = "Fujairah";
    Emirates["RasAlKhaimah"] = "RasAlKhaimah";
    Emirates["UmmAlQuwain"] = "UmmAlQuwain";
})(Emirates || (exports.Emirates = Emirates = {}));
let Vehicle = class Vehicle {
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "vehicleNo", type: "varchar", length: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "code", type: "varchar", length: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Vehicle.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_type_entity_1.VehicleType, (vehicleType) => vehicleType, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", vehicle_type_entity_1.VehicleType)
], Vehicle.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_entity_1.Model, (Model) => Model, { eager: true, cascade: true }),
    __metadata("design:type", model_entity_1.Model)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => owned_by_entity_1.OwnedBy, (ownedBy) => ownedBy, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", owned_by_entity_1.OwnedBy)
], Vehicle.prototype, "ownedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => aggregator_entity_1.Aggregator, (aggregator) => aggregator, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", aggregator_entity_1.Aggregator)
], Vehicle.prototype, "aggregator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "date",
        nullable: true,
        transformer: {
            to(value) {
                return value ? moment(value, "DD-MM-YYYY").toDate() : value;
            },
            from(value) {
                return value ? moment(value).format("DD-MM-YYYY") : null;
            },
        },
    }),
    (0, class_validator_1.Matches)(/^\d{2}-\d{2}-\d{4}$/, {
        message: "Date must be in the format dd-mm-yyyy",
    }),
    __metadata("design:type", Date)
], Vehicle.prototype, "registrationExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: Emirates }),
    (0, class_validator_1.IsEnum)(Emirates),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Vehicle.prototype, "emirates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "chasisNumber", type: "varchar", length: 50, unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Vehicle.prototype, "chasisNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Vehicle.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["available", "occupied"] }),
    (0, class_validator_1.IsEnum)(["available", "occupied"]),
    __metadata("design:type", String)
], Vehicle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "isActive", type: "boolean", default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "isDeleted", type: "boolean", default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "transactions", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)("vehicle"),
    (0, typeorm_1.Unique)(["code", "vehicleNo"]),
    (0, typeorm_1.Unique)(["chasisNumber"])
], Vehicle);
//# sourceMappingURL=vehical.entity.js.map