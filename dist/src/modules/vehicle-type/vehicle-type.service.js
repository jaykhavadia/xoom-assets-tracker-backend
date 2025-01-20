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
var VehicleTypeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_type_entity_1 = require("./entities/vehicle-type.entity");
const messages_constants_1 = require("../../constants/messages.constants");
let VehicleTypeService = VehicleTypeService_1 = class VehicleTypeService {
    constructor(vehicleTypeRepository) {
        this.vehicleTypeRepository = vehicleTypeRepository;
        this.logger = new common_1.Logger(VehicleTypeService_1.name);
    }
    async create(vehicleType) {
        try {
            const newVehicleType = this.vehicleTypeRepository.create(vehicleType);
            return await this.vehicleTypeRepository.save(newVehicleType);
        }
        catch (error) {
            this.logger.error('[VehicleTypeService] [create] Error:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(name, fuel) {
        try {
            const filters = {};
            if (name) {
                filters.name = name;
            }
            if (fuel) {
                filters.fuel = fuel;
            }
            const vehicleTypes = await this.vehicleTypeRepository.find({
                where: filters,
            });
            return vehicleTypes;
        }
        catch (error) {
            this.logger.error('[VehicleTypeService] [findAll] Error:', error);
            throw new common_1.HttpException('Error fetching vehicle types', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            return await this.vehicleTypeRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('[VehicleTypeService] [findOne] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.vehicleType.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            await this.vehicleTypeRepository.update(id, updateData);
            return this.findOne(id);
        }
        catch (error) {
            this.logger.error('[VehicleTypeService] [update] Error:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.vehicleTypeRepository.delete(id);
            return { message: 'Vehicle type deleted successfully.' };
        }
        catch (error) {
            this.logger.error('[VehicleTypeService] [remove] Error:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.VehicleTypeService = VehicleTypeService;
exports.VehicleTypeService = VehicleTypeService = VehicleTypeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_type_entity_1.VehicleType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehicleTypeService);
//# sourceMappingURL=vehicle-type.service.js.map