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
var VehicleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vehical_entity_1 = require("./entities/vehical.entity");
const typeorm_2 = require("typeorm");
const vehicle_type_entity_1 = require("../vehicle-type/entities/vehicle-type.entity");
const model_entity_1 = require("../model/entities/model.entity");
const aggregator_entity_1 = require("../aggregator/entities/aggregator.entity");
const owned_by_entity_1 = require("../owned-by/entities/owned_by.entity");
let VehicleService = VehicleService_1 = class VehicleService {
    constructor(vehicleRepository, vehicleTypeRepository, modelRepository, aggregatorRepository, ownedByRepository) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleTypeRepository = vehicleTypeRepository;
        this.modelRepository = modelRepository;
        this.aggregatorRepository = aggregatorRepository;
        this.ownedByRepository = ownedByRepository;
        this.logger = new common_1.Logger(VehicleService_1.name);
    }
    async create(createVehicleDto) {
        try {
            const createVehicle = await this.checkRelation(createVehicleDto);
            const vehicle = this.vehicleRepository.create(createVehicle);
            return await this.vehicleRepository.save(vehicle);
        }
        catch (error) {
            this.logger.error(`[VehicleService] [create] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findAll(status) {
        try {
            let vehicles;
            if (status) {
                vehicles = await this.vehicleRepository.find({ where: { status } });
            }
            else {
                vehicles = await this.vehicleRepository.find();
            }
            return vehicles;
        }
        catch (error) {
            this.logger.error(`[VehicleService] [findAll] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException("Failed to retrieve vehicles.");
        }
    }
    async findOne(id) {
        try {
            return await this.vehicleRepository.findOneBy({ id });
        }
        catch (error) {
            this.logger.error(`[VehicleService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to find vehicle with id: ${id}`);
        }
    }
    async findByVehicleNo(vehicleNo) {
        try {
            return await this.vehicleRepository.findOneBy({ vehicleNo });
        }
        catch (error) {
            this.logger.error(`[VehicleService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to find vehicle with id: ${vehicleNo}`);
        }
    }
    async update(id, updateVehicleDto) {
        try {
            const updatedVehicle = await this.checkRelation(updateVehicleDto);
            await this.vehicleRepository.update(id, updatedVehicle);
            return await this.findOne(id);
        }
        catch (error) {
            this.logger.error(`[VehicleService] [update] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to update vehicle with id: ${id}`);
        }
    }
    async remove(id) {
        try {
            let vehicle = await this.findOne(id);
            if (!vehicle) {
                throw new common_1.InternalServerErrorException(`No data with id: ${id}`);
            }
            await this.vehicleRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`[VehicleService] [remove] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to delete vehicle with id: ${id}`);
        }
    }
    async updateVehicles(vehicles) {
        try {
            this.logger.log("Starting updateVehicles function.");
            await this.vehicleRepository.save(vehicles);
            this.logger.log("Successfully updated vehicles.");
        }
        catch (error) {
            this.logger.error(`[VehicleService] [updateVehicles] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException("Failed to update vehicles.");
        }
    }
    async checkRelation(checkRelationDto) {
        const { vehicleTypeId, modelId, ownedById, aggregatorId, ...vehicleDto } = checkRelationDto;
        const vehicleType = await this.vehicleTypeRepository.findOne({
            where: { id: vehicleTypeId },
        });
        const model = await this.modelRepository.findOne({
            where: { id: modelId },
        });
        const ownedBy = await this.ownedByRepository.findOne({
            where: { id: ownedById },
        });
        const aggregator = await this.aggregatorRepository.findOne({
            where: aggregatorId ? { id: aggregatorId } : { name: "idle" },
        });
        const missingFields = [];
        if (!vehicleType)
            missingFields.push(`vehicleType (ID: ${vehicleTypeId})`);
        if (!model)
            missingFields.push(`model (ID: ${modelId})`);
        if (!ownedBy)
            missingFields.push(`ownedBy (ID: ${ownedById})`);
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`Invalid or missing fields: ${missingFields.join(", ")}`);
        }
        return {
            vehicleType,
            model,
            ownedBy,
            aggregator,
            ...vehicleDto,
        };
    }
    async getFilteredVehicles(model, ownedBy, vehicleType, aggregatorName) {
        const queryBuilder = this.vehicleRepository
            .createQueryBuilder("vehicle")
            .leftJoinAndSelect("vehicle.model", "model")
            .leftJoinAndSelect("vehicle.ownedBy", "owner")
            .leftJoinAndSelect("vehicle.vehicleType", "type")
            .leftJoinAndSelect("vehicle.aggregator", "aggregator");
        if (model) {
            queryBuilder.andWhere("model.brand = :model", { model });
        }
        if (ownedBy) {
            queryBuilder.andWhere("owner.name = :ownedBy", { ownedBy });
        }
        if (vehicleType) {
            if (!vehicleType || vehicleType.split("-").length !== 2) {
                throw new Error(`Invalid vehicleType format. Expected 'name - fuel', got '${vehicleType}'`);
            }
            const [vehicleTypeName, vehicleFuel] = vehicleType.split("-");
            queryBuilder.andWhere("type.name = :vehicleTypeName AND type.fuel = :vehicleFuel", {
                vehicleTypeName,
                vehicleFuel,
            });
        }
        if (aggregatorName) {
            queryBuilder.andWhere("aggregator.name = :aggregatorName", {
                aggregatorName,
            });
        }
        const vehicles = await queryBuilder.getMany();
        return vehicles;
    }
    async getVehicleCountByAggregator() {
        return this.vehicleRepository
            .createQueryBuilder("vehicle")
            .leftJoinAndSelect("vehicle.aggregator", "aggregator")
            .select("aggregator.name", "aggregatorName")
            .addSelect("COUNT(vehicle.id)", "vehicleCount")
            .groupBy("aggregator.name")
            .getRawMany();
    }
    async getVehicleCountByModel() {
        return this.vehicleRepository
            .createQueryBuilder("vehicle")
            .leftJoin("vehicle.model", "model")
            .select("model.brand", "modelBrand")
            .addSelect("COUNT(vehicle.id)", "vehicleCount")
            .addSelect("SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)", "available")
            .addSelect("SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)", "occupied")
            .groupBy("model.brand")
            .setParameters({
            available: "available",
            occupied: "occupied",
        })
            .getRawMany();
    }
    async getVehicleCountByOwner() {
        return this.vehicleRepository
            .createQueryBuilder("vehicle")
            .leftJoin("vehicle.ownedBy", "ownedBy")
            .select("ownedBy.name", "ownerName")
            .addSelect("COUNT(vehicle.id)", "vehicleCount")
            .addSelect("SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)", "available")
            .addSelect("SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)", "occupied")
            .groupBy("ownedBy.name")
            .setParameters({
            available: "available",
            occupied: "occupied",
        })
            .getRawMany();
    }
    async getVehicleCountByType() {
        return this.vehicleRepository
            .createQueryBuilder("vehicle")
            .leftJoin("vehicle.vehicleType", "vehicleType")
            .select("CONCAT(vehicleType.name, ' - ', vehicleType.fuel)", "vehicleTypeName")
            .addSelect("COUNT(vehicle.id)", "vehicleCount")
            .addSelect("SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)", "available")
            .addSelect("SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)", "occupied")
            .groupBy("vehicleType.name, vehicleType.fuel")
            .setParameters({
            available: "available",
            occupied: "occupied",
        })
            .getRawMany();
    }
    async getVehiclesByLocationName(locationName) {
        const queryBuilder = this.vehicleRepository
            .createQueryBuilder("vehicle")
            .leftJoin("vehicle.transactions", "transaction")
            .leftJoin("transaction.location", "location")
            .select("location.name", "locationName")
            .addSelect("COUNT(vehicle.id)", "vehicleCount")
            .addSelect("SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)", "available")
            .addSelect("SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)", "occupied")
            .groupBy("location.name")
            .setParameters({
            available: "available",
            occupied: "occupied",
        });
        queryBuilder.andWhere("location.name IS NOT NULL");
        if (locationName && locationName !== "null") {
            queryBuilder.andWhere("location.name = :locationName", { locationName });
        }
        const vehicles = await queryBuilder.getRawMany();
        if (!vehicles || vehicles.length === 0) {
            throw new Error(`No vehicles found for location: ${locationName}`);
        }
        return vehicles;
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = VehicleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehical_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_type_entity_1.VehicleType)),
    __param(2, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(3, (0, typeorm_1.InjectRepository)(aggregator_entity_1.Aggregator)),
    __param(4, (0, typeorm_1.InjectRepository)(owned_by_entity_1.OwnedBy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map