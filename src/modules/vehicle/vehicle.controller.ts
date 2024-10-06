import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
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

  @Post()
  async create(
    @Body(new ValidationPipe()) vehicle: Vehicle
  ): Promise<response<Vehicle>> {
    try {
      const response = await this.vehicleService.create(vehicle);
      return {
        success: true,
        message: Messages.vehicle.createSuccess,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [create] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.createFailure, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<response<Vehicle[]>> {
    try {
      const response = await this.vehicleService.findAll();
      return {
        success: true,
        message: Messages.vehicle.findAllSuccess,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [findAll] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.findAllFailure, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string // Get id as string
  ): Promise<response<Vehicle>> {
    const vehicleId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.vehicleService.findOne(vehicleId);
      if (!response) {
        throw new HttpException(Messages.vehicle.findOneFailure(vehicleId), HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: Messages.vehicle.findOneSuccess(vehicleId),
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [findOne] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.findOneFailure(vehicleId), HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string, // Get id as string
    @Body(new ValidationPipe()) vehicle: Vehicle
  ): Promise<response<Vehicle>> {
    const vehicleId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.vehicleService.update(vehicleId, vehicle);
      return {
        success: true,
        message: Messages.vehicle.updateSuccess(vehicleId),
        data: response,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [update] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.updateFailure(vehicleId), HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string // Get id as string
  ): Promise<response<void>> {
    const vehicleId = parseInt(id, 10); // Convert to number
    try {
      await this.vehicleService.remove(vehicleId);
      return {
        success: true,
        message: Messages.vehicle.removeSuccess(vehicleId),
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [remove] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.removeFailure(vehicleId), HttpStatus.BAD_REQUEST);
    }
  }

  @Post('update-vehicles')
  async updateVehicles(
    @Body(new ValidationPipe()) vehicles: Vehicle[]
  ): Promise<response<void>> {
    try {
      await this.vehicleService.updateVehicles(vehicles);
      return {
        success: true,
        message: Messages.vehicle.updateBulkSuccess,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [updateVehicles] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.updateBulkFailure, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<response<void>> {
    try {
      const vehicles = await this.uploadService.readExcel(file, 'vehicle');
      // Save vehicles to the database
      await this.vehicleService.updateVehicles(vehicles as Vehicle[]);
      return {
        success: true,
        message: Messages.vehicle.updateBulkSuccess,
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [uploadExcel] Error: ${error.message}`);
      throw new HttpException(Messages.vehicle.updateBulkFailure, HttpStatus.BAD_REQUEST);
    }
  }
}
