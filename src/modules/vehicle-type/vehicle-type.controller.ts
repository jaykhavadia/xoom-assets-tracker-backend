// src/modules/vehicle-type/vehicle-type.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleType } from './entities/vehicle-type.entity';

@Controller('vehicle-type')
export class VehicleTypeController {
  private readonly logger = new Logger(VehicleTypeController.name);

  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post()
  async create(@Body() vehicleType: Partial<VehicleType>) {
    try {
      return await this.vehicleTypeService.create(vehicleType);
    } catch (error) {
      this.logger.error('[VehicleTypeController] [create] Error:', error);
      throw error; // Let the service handle the response message
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.vehicleTypeService.findAll();
    } catch (error) {
      this.logger.error('[VehicleTypeController] [findAll] Error:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.vehicleTypeService.findOne(id);
    } catch (error) {
      this.logger.error('[VehicleTypeController] [findOne] Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<VehicleType>) {
    try {
      return await this.vehicleTypeService.update(id, updateData);
    } catch (error) {
      this.logger.error('[VehicleTypeController] [update] Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.vehicleTypeService.remove(id);
    } catch (error) {
      this.logger.error('[VehicleTypeController] [remove] Error:', error);
      throw error;
    }
  }
}
