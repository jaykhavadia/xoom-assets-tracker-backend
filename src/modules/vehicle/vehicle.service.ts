import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehical.entity';
import { Repository } from 'typeorm';
import { VehicleDto } from './dto/create-vehicle.dto';
import { VehicleType } from '../vehicle-type/entities/vehicle-type.entity';
import { Model } from '../model/entities/model.entity';
import { Aggregator } from '../aggregator/entities/aggregator.entity';
import { OwnedBy } from '../owned-by/entities/owned_by.entity';
import * as moment from 'moment';

@Injectable()
export class VehicleService {

    private readonly logger = new Logger(VehicleService.name); // Logger with class name

    constructor(
        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>,
        @InjectRepository(VehicleType)
        private readonly vehicleTypeRepository: Repository<VehicleType>,
        @InjectRepository(Model)
        private readonly modelRepository: Repository<Model>,
        @InjectRepository(Aggregator)
        private readonly aggregatorRepository: Repository<Aggregator>,
        @InjectRepository(OwnedBy)
        private readonly ownedByRepository: Repository<OwnedBy>,
    ) { }

    /**
     * Creates a new vehicle entry in the database
     * @param vehicle - the vehicle object to be created
     * @returns the created vehicle
     */
    async create(createVehicleDto: VehicleDto): Promise<Vehicle> {
        try {
            const createVehicle = await this.checkRelation(createVehicleDto);
            const vehicle = this.vehicleRepository.create(createVehicle);
            return await this.vehicleRepository.save(vehicle);
        } catch (error) {
            this.logger.error(`[VehicleService] [create] Error: ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Retrieves all vehicles from the database
     * @returns an array of vehicles
     */
    async findAll(status?: "available" | "occupied"): Promise<Vehicle[]> {
        try {
            let vehicles: Vehicle[];
            if (status) {
                // Filter vehicles by status
                vehicles = await this.vehicleRepository.find({ where: { status } });
            } else {
                // Get all vehicles if no status is provided
                vehicles = await this.vehicleRepository.find();
            }
            return vehicles;
        } catch (error) {
            this.logger.error(`[VehicleService] [findAll] Error: ${error.message}`);
            throw new InternalServerErrorException('Failed to retrieve vehicles.');
        }
    }

    /**
     * Retrieves a vehicle by its ID
     * @param id - the ID of the vehicle to retrieve
     * @returns the found vehicle
     */
    async findOne(id: string): Promise<Vehicle> {
        try {
            return await this.vehicleRepository.findOneBy({ id });
        } catch (error) {
            this.logger.error(`[VehicleService] [findOne] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to find vehicle with id: ${id}`);
        }
    }

    /**
     * Updates an existing vehicle in the database
     * @param id - the ID of the vehicle to update
     * @param updateVehicleDto - the vehicle object with updated information
     * @returns the updated vehicle
     */
    async update(id: string, updateVehicleDto: VehicleDto): Promise<Vehicle> {
        try {
            const updatedVehicle = await this.checkRelation(updateVehicleDto);
            await this.vehicleRepository.update(id, updatedVehicle);
            return await this.findOne(id);
        } catch (error) {
            this.logger.error(`[VehicleService] [update] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to update vehicle with id: ${id}`);
        }
    }

    /**
     * Removes a vehicle by its ID
     * @param id - the ID of the vehicle to remove
     */
    async remove(id: string): Promise<void> {
        try {
            let vehicle = await this.findOne(id);
            if (!vehicle) {
                throw new InternalServerErrorException(`No data with id: ${id}`);
            }
            await this.vehicleRepository.delete(id);
        } catch (error) {
            this.logger.error(`[VehicleService] [remove] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to delete vehicle with id: ${id}`);
        }
    }

    /**
     * Clears the Vehicle table and inserts new vehicle data
     * @param vehicles - array of new vehicles to be inserted
     */
    async updateVehicles(vehicles: Vehicle[]): Promise<void> {
        try {
            this.logger.log('Starting updateVehicles function.');

            // Disable foreign key checks before truncating the table
            await this.vehicleRepository.query('SET FOREIGN_KEY_CHECKS = 0');

            // Clear the vehicle table
            await this.vehicleRepository.clear();

            // Re-enable foreign key checks after clearing the table
            await this.vehicleRepository.query('SET FOREIGN_KEY_CHECKS = 1');
            // Insert the new vehicle data
            await this.vehicleRepository.save(vehicles);

            this.logger.log('Successfully updated vehicles.');
        } catch (error) {
            this.logger.error(`[VehicleService] [updateVehicles] Error: ${error.message}`);
            throw new InternalServerErrorException('Failed to update vehicles.');
        }
    }

    async checkRelation(checkRelationDto: VehicleDto): Promise<{
        vehicleType: VehicleType,
        model: Model,
        ownedBy: OwnedBy,
        aggregator: Aggregator
    }> {
        const { vehicleTypeId, modelId, ownedById, aggregatorId, ...vehicleDto } = checkRelationDto;
        // Fetch the related entities based on the IDs
        const vehicleType = await this.vehicleTypeRepository.findOne({ where: { id: vehicleTypeId } });
        const model = await this.modelRepository.findOne({ where: { id: modelId } });
        const ownedBy = await this.ownedByRepository.findOne({ where: { id: ownedById } });
        const aggregator = await this.aggregatorRepository.findOne({ where: vehicleDto.status !== 'available' ? { id: aggregatorId } :{ name: 'idle' } });
        const missingFields = [];
        
        if (!vehicleType) missingFields.push(`vehicleType (ID: ${vehicleTypeId})`);
        if (!model) missingFields.push(`model (ID: ${modelId})`);
        if (!ownedBy) missingFields.push(`ownedBy (ID: ${ownedById})`);

        if (missingFields.length > 0) {
            throw new BadRequestException(`Invalid or missing fields: ${missingFields.join(', ')}`);
        }
        return {
            vehicleType,
            model,
            ownedBy,
            aggregator,
            ...vehicleDto
        };
    }

    async getFilteredVehicles(
        model?: string,
        ownedBy?: string,
        vehicleType?: string,
        aggregatorName?: string
    ): Promise<any> {
        const queryBuilder = this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.model', 'model')
            .leftJoinAndSelect('vehicle.ownedBy', 'owner')
            .leftJoinAndSelect('vehicle.vehicleType', 'type')
            .leftJoinAndSelect('vehicle.aggregator', 'aggregator');

        if (model) {
            queryBuilder.andWhere('model.brand = :model', { model });
        }
        if (ownedBy) {
            queryBuilder.andWhere('owner.name = :ownedBy', { ownedBy });
        }
        if (vehicleType) {
            if (!vehicleType || vehicleType.split('-').length !== 2) {
                throw new Error(`Invalid vehicleType format. Expected 'name - fuel', got '${vehicleType}'`);
            }

            const [vehicleTypeName, vehicleFuel] = vehicleType.split('-');
            queryBuilder.andWhere(
                "type.name = :vehicleTypeName AND type.fuel = :vehicleFuel",
                {
                    vehicleTypeName,
                    vehicleFuel,
                }
            );
        }
        if (aggregatorName) {
            queryBuilder.andWhere("aggregator.name = :aggregatorName", {
                aggregatorName,
            });
        }

        const vehicles = await queryBuilder.getMany();

        // Return an empty array if no vehicles match the filters.
        return vehicles;
    }

    async getVehicleCountByAggregator() {
        return this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.aggregator', 'aggregator')
            .select('aggregator.name', 'aggregatorName')
            .addSelect('COUNT(vehicle.id)', 'vehicleCount')
            .groupBy('aggregator.name')
            .getRawMany();
    }

    async getVehicleCountByModel() {
        return this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoin('vehicle.model', 'model')
            .select('model.brand', 'modelBrand')
            .addSelect('COUNT(vehicle.id)', 'vehicleCount')
            .addSelect('SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)', 'available')
            .addSelect('SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)', 'occupied')
            .groupBy('model.brand')
            .setParameters({
                available: 'available',
                occupied: 'occupied',
            })
            .getRawMany();
    }

    async getVehicleCountByOwner() {
        return this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoin('vehicle.ownedBy', 'ownedBy')
            .select('ownedBy.name', 'ownerName')
            .addSelect('COUNT(vehicle.id)', 'vehicleCount')
            .addSelect('SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)', 'available')
            .addSelect('SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)', 'occupied')
            .groupBy('ownedBy.name')
            .setParameters({
                available: 'available',
                occupied: 'occupied',
            })
            .getRawMany();
    }


    async getVehicleCountByType() {
        return this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoin('vehicle.vehicleType', 'vehicleType')
            .select('CONCAT(vehicleType.name, \' - \', vehicleType.fuel)', 'vehicleTypeName')
            .addSelect('COUNT(vehicle.id)', 'vehicleCount')
            .addSelect('SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)', 'available')
            .addSelect('SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)', 'occupied')
            .groupBy('vehicleType.name, vehicleType.fuel')
            .setParameters({
                available: 'available',
                occupied: 'occupied',
            })
            .getRawMany();
    }

    async getVehiclesByLocationName(locationName: string): Promise<Vehicle[]> {
        const queryBuilder = this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoin('vehicle.transactions', 'transaction')
            .leftJoin('transaction.location', 'location')
            .select('location.name', 'locationName')
            .addSelect('COUNT(vehicle.id)', 'vehicleCount')
            .addSelect('SUM(CASE WHEN vehicle.status = :available THEN 1 ELSE 0 END)', 'available')
            .addSelect('SUM(CASE WHEN vehicle.status = :occupied THEN 1 ELSE 0 END)', 'occupied')
            .groupBy('location.name')
            .setParameters({
                available: 'available',
                occupied: 'occupied',
            });

        // Ensure location.name is not null
        queryBuilder.andWhere('location.name IS NOT NULL');

        if (locationName && locationName !== 'null') {
            queryBuilder.andWhere('location.name = :locationName', { locationName });
        }

        const vehicles = await queryBuilder.getRawMany();

        // Check if no vehicles are found
        if (!vehicles || vehicles.length === 0) {
            throw new Error(`No vehicles found for location: ${locationName}`);
        }

        return vehicles;
    }


}
