// src/modules/vehicle-type/vehicle-type.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleType } from './entities/vehicle-type.entity';
import { Messages } from 'src/constants/messages.constants';

@Injectable()
export class VehicleTypeService {
  private readonly logger = new Logger(VehicleTypeService.name);

  constructor(
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepository: Repository<VehicleType>,
  ) { }

  async create(vehicleType: Partial<VehicleType>) {
    try {
      const newVehicleType = this.vehicleTypeRepository.create(vehicleType);
      return await this.vehicleTypeRepository.save(newVehicleType);
    } catch (error) {
      this.logger.error('[VehicleTypeService] [create] Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(name?: string, fuel?: string) {
    try {
      const filters: any = {};  // Initialize an empty object to hold the filters

      // Add filter for 'name' if provided
      if (name) {
        filters.name = name;
      }

      // Add filter for 'fuel' if provided
      if (fuel) {
        filters.fuel = fuel;
      }

      // Find vehicle types based on the provided filters
      const vehicleTypes = await this.vehicleTypeRepository.find({
        where: filters,  // Apply the filters to the query
      });

      return vehicleTypes;
    } catch (error) {
      this.logger.error('[VehicleTypeService] [findAll] Error:', error);
      throw new HttpException('Error fetching vehicle types', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.vehicleTypeRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error('[VehicleTypeService] [findOne] Error:', error);
      throw new HttpException(Messages.vehicleType.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateData: Partial<VehicleType>) {
    try {
      await this.vehicleTypeRepository.update(id, updateData);
      return this.findOne(id);
    } catch (error) {
      this.logger.error('[VehicleTypeService] [update] Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.vehicleTypeRepository.delete(id);
      return { message: 'Vehicle type deleted successfully.' };
    } catch (error) {
      this.logger.error('[VehicleTypeService] [remove] Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
