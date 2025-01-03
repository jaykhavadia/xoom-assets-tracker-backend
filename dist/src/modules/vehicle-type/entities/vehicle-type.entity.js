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
exports.VehicleType = exports.Fuel = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const vehical_entity_1 = require("../../vehicle/entities/vehical.entity");
var Fuel;
(function (Fuel) {
    Fuel["Electric"] = "Electric";
    Fuel["ICE"] = "ICE";
    Fuel["Hybrid"] = "Hybrid";
})(Fuel || (exports.Fuel = Fuel = {}));
let VehicleType = class VehicleType {
};
exports.VehicleType = VehicleType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VehicleType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VehicleType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Fuel,
    }),
    (0, class_validator_1.IsEnum)(Fuel),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VehicleType.prototype, "fuel", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehical_entity_1.Vehicle, (vehicle) => vehicle.vehicleType),
    __metadata("design:type", Array)
], VehicleType.prototype, "vehicles", void 0);
exports.VehicleType = VehicleType = __decorate([
    (0, typeorm_1.Entity)('vehicle_type'),
    (0, typeorm_1.Unique)(['name', 'fuel'])
], VehicleType);
//# sourceMappingURL=vehicle-type.entity.js.map