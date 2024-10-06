import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Vehicle } from './entities/vehical.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { Messages } from 'src/constants/messages.constants';

@Controller('vehicle')
export class VehicleController {
  private readonly logger = new Logger(VehicleController.name);

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly uploadService: UploadService,
  ) { }

  /**
     * Create a new vehicle.
     * @param vehicle The vehicle data to be created.
     * @returns A response object indicating success or failure.
     */
  @Post()
  async create(
    @Body() vehicle: Vehicle
  ): Promise<{ success: boolean; message: string; data?: Vehicle }> {
    try {
      const response = await this.vehicleService.create(vehicle);
      return {
        success: true,
        message: Messages.vehicle.createSuccess, // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [create] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.vehicle.createFailure,
      };
    }
  }

  /**
   * Retrieve all vehicles.
   * @returns A response object with a list of vehicles.
   */
  @Get()
  async findAll(): Promise<{ success: boolean; message: string; data?: Vehicle[] }> {
    try {
      const response = await this.vehicleService.findAll();
      return {
        success: true,
        message: Messages.vehicle.findAllSuccess, // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [findAll] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.vehicle.findAllFailure,
      };
    }
  }

  /**
   * Retrieve a vehicle by its ID.
   * @param id The ID of the vehicle to retrieve.
   * @returns A response object with the vehicle data.
   */
  @Get(':id')
  async findOne(
    @Param('id') id: number
  ): Promise<{ success: boolean; message: string; data?: Vehicle }> {
    try {
      const response = await this.vehicleService.findOne(id);
      return {
        success: true,
        message: Messages.vehicle.findOneSuccess(id), // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [findOne] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.vehicle.findOneFailure(id), // Using constant message
      };
    }
  }

  /**
   * Update a vehicle by its ID.
   * @param id The ID of the vehicle to update.
   * @param vehicle The updated vehicle data.
   * @returns A response object indicating success or failure.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() vehicle: Vehicle
  ): Promise<{ success: boolean; message: string; data?: Vehicle }> {
    try {
      const response = await this.vehicleService.update(id, vehicle);
      return {
        success: true,
        message: Messages.vehicle.updateSuccess(id), // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [update] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.vehicle.updateFailure(id), // Using constant message
      };
    }
  }

  /**
   * Delete a vehicle by its ID.
   * @param id The ID of the vehicle to delete.
   * @returns A response object indicating success or failure.
   */
  @Delete(':id')
  async remove(
    @Param('id') id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.vehicleService.remove(id);
      return {
        success: true,
        message: Messages.vehicle.removeSuccess(id), // Using constant message
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [remove] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.vehicle.removeFailure(id), // Using constant message
      };
    }
  }

  /**
   * Update multiple vehicles in the database.
   * @param vehicles An array of vehicles to update.
   * @returns A response object indicating success or failure.
   */
  @Post('update-vehicles')
  async updateVehicles(
    @Body() vehicles: Vehicle[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.vehicleService.updateVehicles(vehicles);
      return {
        success: true,
        message: Messages.vehicle.updateBulkSuccess, // Using constant message
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [updateVehicles] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.vehicle.updateBulkFailure,
      };
    }
  }

  /**
   * Endpoint to clear the vehicle table and insert new data
   * @param vehicles - array of new vehicles to be inserted
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<{ success: boolean; message: string }> {
    try {
      const vehicles = await this.uploadService.readExcel(file, 'vehicle');
      // Save vehicles to the database
      await this.vehicleService.updateVehicles(vehicles as Vehicle[]);
      return {
        success: true,
        message: Messages.vehicle.updateBulkSuccess,
      };  // Return the read vehicles or any response you prefer
    } catch (error) {
      console.error("[VehicleController] [uploadExcel] error:", error)
      return {
        success: false,
        message: Messages.vehicle.updateBulkFailure,
      };
    }
  }
}
