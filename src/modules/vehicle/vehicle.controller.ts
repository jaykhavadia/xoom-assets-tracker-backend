import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Vehicle } from './entities/vehical.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { Employee } from '../employee/entities/employee.entity';

@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly uploadService: UploadService,
  ) { }

  @Get()
  async getVehicle(){
    console.log('testing get');
    
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<Vehicle[] | Employee[]> {
    try {
      const vehicles = await this.uploadService.readExcel(file,'vehicle');
      console.log("🚀 ~ VehicleController ~ uploadExcel ~ vehicles:", vehicles)
      // Save vehicles to the database
      // await this.uploadService.saveVehicles(vehicles);
      return vehicles;  // Return the read vehicles or any response you prefer
    } catch (error) {
      console.error("[VehicleController] [uploadExcel] error:", error)
      throw new BadRequestException(error.message); 
    }
  }
}
