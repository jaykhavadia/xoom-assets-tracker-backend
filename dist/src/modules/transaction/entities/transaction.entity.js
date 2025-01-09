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
exports.Transaction = exports.Action = exports.PicturePosition = void 0;
const employee_entity_1 = require("../../employee/entities/employee.entity");
const location_entity_1 = require("../../location/entities/location.entity");
const vehical_entity_1 = require("../../vehicle/entities/vehical.entity");
const typeorm_1 = require("typeorm");
var PicturePosition;
(function (PicturePosition) {
    PicturePosition["BACK"] = "back";
    PicturePosition["FRONT"] = "front";
    PicturePosition["LEFT"] = "left";
    PicturePosition["RIGHT"] = "right";
})(PicturePosition || (exports.PicturePosition = PicturePosition = {}));
var Action;
(function (Action) {
    Action["IN"] = "in";
    Action["OUT"] = "out";
})(Action || (exports.Action = Action = {}));
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Transaction.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Transaction.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Action, nullable: false }),
    __metadata("design:type", String)
], Transaction.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Transaction.prototype, "pictures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehical_entity_1.Vehicle, (vehicle) => vehicle.transactions, { cascade: true }),
    __metadata("design:type", vehical_entity_1.Vehicle)
], Transaction.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (employee) => employee.transactions, { cascade: true }),
    __metadata("design:type", employee_entity_1.Employee)
], Transaction.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, (location) => location.transactions, { cascade: true }),
    __metadata("design:type", location_entity_1.Location)
], Transaction.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "aggregator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)()
], Transaction);
//# sourceMappingURL=transaction.entity.js.map