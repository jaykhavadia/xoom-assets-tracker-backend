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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_entity_1 = require("./entities/location.entity");
let LocationService = class LocationService {
    constructor(locationRepository) {
        this.locationRepository = locationRepository;
    }
    async create(location) {
        try {
            const newLocation = this.locationRepository.create(location);
            return await this.locationRepository.save(newLocation);
        }
        catch (error) {
            console.log("[LocationService] [create] error:", error);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findAll() {
        try {
            return await this.locationRepository.find();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`[LocationService] [findAll] Error: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const location = await this.locationRepository.findOne({ where: { id } });
            if (!location) {
                throw new common_1.NotFoundException(`Location with ID ${id} not found`);
            }
            return location;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`[LocationService] [findOne] Error: ${error.message}`);
        }
    }
    async findByName(name) {
        try {
            const location = await this.locationRepository.findOne({ where: { name } });
            if (!location) {
                throw new common_1.NotFoundException(`Location with name ${name} not found`);
            }
            return location;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`[LocationService] [findOne] Error: ${error.message}`);
        }
    }
    async update(id, location) {
        try {
            const existingLocation = await this.findOne(id);
            if (!existingLocation) {
                throw new common_1.NotFoundException(`Location with ID ${id} not found`);
            }
            await this.locationRepository.update(id, location);
            return await this.findOne(id);
        }
        catch (error) {
            console.log("[LocationService] [update] error:", error);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async remove(id) {
        try {
            const location = await this.findOne(id);
            if (!location) {
                throw new common_1.NotFoundException(`Location with ID ${id} not found`);
            }
            await this.locationRepository.delete(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`[LocationService] [remove] Error: ${error.message}`);
        }
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LocationService);
//# sourceMappingURL=location.service.js.map