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
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { Fuel, VehicleType } from './entities/vehicle-type.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('vehicle-type')
@UseGuards(JwtAuthGuard)
export class VehicleTypeController {
  private readonly logger = new Logger(VehicleTypeController.name);

  constructor(private readonly vehicleTypeService: VehicleTypeService) { }

  // Endpoint for creating a new vehicle type
  @Post()
  async create(@Body() vehicleType: VehicleType): Promise<response<VehicleType>> {
    try {
      const response = await this.vehicleTypeService.create(vehicleType);
      return {
        success: true,
        message: 'Vehicle type created successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleTypeController] [create] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving all vehicle types
  @Get()
  async findAll(
    @Query('name') name?: string,  // Optional query parameter for filtering by name
    @Query('fuel') fuel?: Fuel,  // Optional query parameter for filtering by fuel
  ): Promise<response<VehicleType[]>> {
    try {
      // Call the service with the query parameters
      const response = await this.vehicleTypeService.findAll(name, fuel);

      // Return the response in the desired format
      return {
        success: true,
        message: 'Vehicle types retrieved successfully.',
        data: response,
      };
    } catch (error) {
      // Log the error and throw an exception
      this.logger.error(`[VehicleTypeController] [findAll] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving a specific vehicle type by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<response<VehicleType>> {
    try {
      const response = await this.vehicleTypeService.findOne(id);
      return {
        success: true,
        message: 'Vehicle type retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleTypeController] [findOne] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for updating a specific vehicle type by ID
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<VehicleType>): Promise<response<VehicleType>> {
    try {
      const response = await this.vehicleTypeService.update(id, updateData);
      return {
        success: true,
        message: 'Vehicle type updated successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleTypeController] [update] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for deleting a specific vehicle type by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<response<VehicleType>> {
    try {
      await this.vehicleTypeService.remove(id);
      return {
        success: true,
        message: 'Vehicle type removed successfully.',
        data: null,
      };
    } catch (error) {
      this.logger.error(`[VehicleTypeController] [remove] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}