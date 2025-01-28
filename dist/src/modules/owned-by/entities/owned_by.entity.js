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
exports.OwnedBy = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const vehical_entity_1 = require("../../vehicle/entities/vehical.entity");
let OwnedBy = class OwnedBy {
};
exports.OwnedBy = OwnedBy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OwnedBy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OwnedBy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehical_entity_1.Vehicle, (vehicle) => vehicle.ownedBy),
    __metadata("design:type", Array)
], OwnedBy.prototype, "vehicles", void 0);
exports.OwnedBy = OwnedBy = __decorate([
    (0, typeorm_1.Entity)('owned_by')
], OwnedBy);
//# sourceMappingURL=owned_by.entity.js.map