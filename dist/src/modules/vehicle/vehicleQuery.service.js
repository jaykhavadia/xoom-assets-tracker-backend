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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VehicleQueryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleQueryService = void 0;
const vehical_entity_1 = require("./entities/vehical.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let VehicleQueryService = VehicleQueryService_1 = class VehicleQueryService {
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
        this.logger = new common_1.Logger(VehicleQueryService_1.name);
    }
    async findVehicleCountByModelAndAggregator() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.model", "m")
                .innerJoinAndSelect("v.aggregator", "a")
                .select(["m.brand AS model", "a.name AS aggregator"])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("m.brand, a.name")
                .orderBy("m.brand");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByModelAndAggregator] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findVehicleCountByAggregatorAndModel() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.model", "m")
                .innerJoinAndSelect("v.aggregator", "a")
                .select(["a.name AS aggregator", "m.brand AS model"])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("a.name, m.brand")
                .orderBy("a.name");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByAggregatorAndModel] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findVehicleCountByOwnerAndAggregator() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.ownedBy", "o")
                .innerJoinAndSelect("v.aggregator", "a")
                .select(["o.name AS owned_by", "a.name AS aggregator"])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("o.name, a.name")
                .orderBy("o.name");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByOwnerAndAggregator] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findVehicleCountByAggregatorAndCategory() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.vehicleType", "vt")
                .innerJoinAndSelect("v.aggregator", "a")
                .select([
                "a.name AS aggregator",
                "vt.name AS category",
                "vt.fuel as fuel",
            ])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("a.name, vt.name, vt.fuel")
                .orderBy("a.name");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByAggregatorAndCategory] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findVehicleCountByAggregatorEmiratesAndCategory() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.vehicleType", "vt")
                .innerJoinAndSelect("v.aggregator", "a")
                .select([
                "a.name AS aggregator",
                "v.emirates AS emirates",
                "vt.name AS category",
                "vt.fuel as fuel",
            ])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("a.name, v.emirates, vt.name, vt.fuel")
                .orderBy("a.name");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByAggregatorEmiratesAndCategory] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findVehicleCountByEmiratesAndCategory() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.vehicleType", "vt")
                .select([
                "v.emirates AS emirates",
                "vt.name AS category",
                "vt.fuel AS fuel",
            ])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("v.emirates, vt.name, vt.fuel")
                .orderBy("v.emirates");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByEmiratesAndCategoryFuel] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findVehicleCountByEmiratesAndOwnedBy() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.ownedBy", "ob")
                .select(["v.emirates AS emirates", "ob.name AS owned_by"])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("v.emirates, ob.name")
                .orderBy("v.emirates");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findVehicleCountByEmiratesAndOwnedBy] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findCategoryOperationByEmirates() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.ownedBy", "ob")
                .innerJoinAndSelect("v.vehicleType", "vt")
                .innerJoinAndSelect("v.aggregator", "a")
                .select([
                "v.emirates AS emirates",
                "ob.name AS owned_by",
                "vt.name AS category",
                "vt.fuel AS fuel",
                "a.name AS aggregator",
            ])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("v.emirates, ob.name, vt.name, vt.fuel, a.name");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findCategoryOperationByEmirates] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findEmiratesCategoryCount() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.ownedBy", "ob")
                .innerJoinAndSelect("v.vehicleType", "vt")
                .select([
                "v.emirates AS emirates",
                "ob.name AS owned_by",
                "vt.name AS category",
                "vt.fuel AS fuel",
            ])
                .addSelect("COUNT(v.id)", "vehicle_count")
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("v.emirates, ob.name, vt.name, vt.fuel")
                .orderBy("v.emirates");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findEmiratesCategoryCount] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findExpiryStatus() {
        try {
            const queryBuilder = this.vehicleRepository
                .createQueryBuilder("v")
                .innerJoinAndSelect("v.model", "m")
                .select([
                "v.emirates AS emirates",
                "m.brand AS model",
                "COUNT(v.id) AS vehicle_count",
                `CASE 
            WHEN MAX(v.registrationExpiry) < CURRENT_DATE THEN 'Expired'
            WHEN MAX(v.registrationExpiry) BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY) THEN 'Near To Expire'
            ELSE 'Valid'
          END AS status`,
            ])
                .where("v.isDeleted = :isDeleted", { isDeleted: false })
                .where("v.isActive = :isActive", { isActive: 1 })
                .groupBy("v.emirates, m.brand")
                .orderBy("v.emirates");
            const result = await queryBuilder.getRawMany();
            return result;
        }
        catch (error) {
            this.logger.error(`[VehicleQueryService] [findExpiryStatus] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.VehicleQueryService = VehicleQueryService;
exports.VehicleQueryService = VehicleQueryService = VehicleQueryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(vehical_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], VehicleQueryService);
//# sourceMappingURL=vehicleQuery.service.js.map