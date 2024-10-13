import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Vehicle } from './entities/vehical.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { Messages } from 'src/constants/messages.constants';
import { SheetService } from '../sheet/sheet.service';
import { Sheet } from '../sheet/entities/sheet.entity';
import { format } from 'date-fns';

// Controller for handling vehicle-related requests
@Controller('vehicle')
export class VehicleController {
  private readonly logger = new Logger(VehicleController.name); // Logger for logging errors and information

  constructor(
    private readonly vehicleService: VehicleService, // Inject VehicleService for business logic
    private readonly uploadService: UploadService,   // Inject UploadService for handling file uploads
    private readonly sheetService: SheetService,
  ) { }

  // Endpoint for creating a new vehicle record
  @Post()
  async create(
    @Body(new ValidationPipe()) vehicle: Vehicle // Validate and parse the vehicle object from request body
  ): Promise<response<Vehicle>> {
    try {
      const response = await this.vehicleService.create(vehicle); // Call service to create vehicle
      return {
        success: true,
        message: Messages.vehicle.createSuccess, // Success message
        data: response, // Return created vehicle data
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [create] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.vehicle.createFailure, HttpStatus.BAD_REQUEST); // Return bad request error
    }
  }

  // Endpoint for fetching all vehicles
  @Get()
  async findAll(@Query('status') status?: string): Promise<response<Vehicle[]>> {
    if (status && status !== "available" && status !== "occupied") {
      throw new HttpException(Messages.vehicle.invalidStatus, HttpStatus.BAD_REQUEST);
    }
    try {
      const response = await this.vehicleService.findAll(status as "available" | "occupied"); // Pass status to the service
      return {
        success: true,
        message: Messages.vehicle.findAllSuccess, // Success message
        data: response, // Return array of vehicles
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [findAll] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.vehicle.findAllFailure, HttpStatus.INTERNAL_SERVER_ERROR); // Internal server error
    }
  }

  // Endpoint for fetching a single vehicle by its ID
  @Get(':id')
  async findOne(
    @Param('id') id: string // Get vehicle ID from request parameters
  ): Promise<response<Vehicle>> {
    const vehicleId = parseInt(id, 10); // Convert ID to a number
    try {
      const response = await this.vehicleService.findOne(vehicleId); // Call service to get vehicle by ID
      if (!response) {
        // If vehicle not found, throw 404 error
        throw new HttpException(Messages.vehicle.findOneFailure(vehicleId), HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: Messages.vehicle.findOneSuccess(vehicleId), // Success message
        data: response, // Return vehicle data
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [findOne] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.vehicle.findOneFailure(vehicleId), HttpStatus.NOT_FOUND); // Not found error
    }
  }

  // Endpoint for updating an existing vehicle by its ID
  @Put(':id')
  async update(
    @Param('id') id: string, // Get vehicle ID from request parameters
    @Body(new ValidationPipe()) vehicle: Vehicle // Validate and parse the vehicle object from request body
  ): Promise<response<Vehicle>> {
    const vehicleId = parseInt(id, 10); // Convert ID to a number
    try {
      const response = await this.vehicleService.update(vehicleId, vehicle); // Call service to update vehicle
      return {
        success: true,
        message: Messages.vehicle.updateSuccess(vehicleId), // Success message
        data: response, // Return updated vehicle data
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [update] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.vehicle.updateFailure(vehicleId), HttpStatus.BAD_REQUEST); // Bad request error
    }
  }

  // Endpoint for deleting a vehicle by its ID
  @Delete(':id')
  async remove(
    @Param('id') id: string // Get vehicle ID from request parameters
  ): Promise<response<void>> {
    const vehicleId = parseInt(id, 10); // Convert ID to a number
    try {
      await this.vehicleService.remove(vehicleId); // Call service to delete vehicle
      return {
        success: true,
        message: Messages.vehicle.removeSuccess(vehicleId), // Success message
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [remove] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.vehicle.removeFailure(vehicleId), HttpStatus.BAD_REQUEST); // Bad request error
    }
  }

  // Endpoint for uploading a file (Excel) to update multiple vehicles in bulk
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Use file interceptor for handling file uploads
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<response<void>> {
    try {
      const vehicles = await this.uploadService.readExcel(file, 'vehicle'); // Parse Excel file and get vehicle data
      await this.vehicleService.updateVehicles(vehicles as Vehicle[]); // Call service to update vehicles in bulk
     
      // Prepare data for the Sheet entity
      const sheetData:  Partial<Sheet> = {
        uploadedAt: new Date(), // Current date and time
        uploadedAtTime: format(new Date(), 'hh:mm a'), // Format the time as '10:30 AM'
        fileUrl: file.originalname, // Assuming the file path is stored in 'file.path'
        type: 'Vehicle', // Assuming the file path is stored in 'file.path'
      };

      // Save the Sheet entry to the database
      await this.sheetService.create(sheetData); // Create a new Sheet entry

      return {
        success: true,
        message: Messages.vehicle.updateBulkSuccess, // Success message
      };
    } catch (error) {
      this.logger.error(`[VehicleController] [uploadExcel] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.vehicle.updateBulkFailure, HttpStatus.BAD_REQUEST); // Bad request error
    }
  }
}
