import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehical.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleService {

    private readonly logger = new Logger(VehicleService.name); // Logger with class name

    constructor(
        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>,
    ) { }

    /**
     * Creates a new vehicle entry in the database
     * @param vehicle - the vehicle object to be created
     * @returns the created vehicle
     */
    async create(vehicle: Vehicle): Promise<Vehicle> {
        try {
            return await this.vehicleRepository.save(vehicle);
        } catch (error) {
            this.logger.error(`[VehicleService] [create] Error: ${error.message}`);
            throw new InternalServerErrorException('Failed to create vehicle.');
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
    async findOne(id: number): Promise<Vehicle> {
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
     * @param vehicle - the vehicle object with updated information
     * @returns the updated vehicle
     */
    async update(id: number, vehicle: Vehicle): Promise<Vehicle> {
        try {
            await this.vehicleRepository.update(id, vehicle);
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
    async remove(id: number): Promise<void> {
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
}
