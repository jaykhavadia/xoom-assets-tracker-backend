import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Vehicle } from '../vehicle/entities/vehical.entity';
import { Employee } from './entities/employee.entity';
import { UploadService } from 'src/common/upload/upload.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<Vehicle[] | Employee[]> {
    try {
      const employee = await this.uploadService.readExcel(file,'employee');
      console.log("🚀 ~ VehicleController ~ uploadExcel ~ employee:", employee)
      // Save employee to the database
      // await this.uploadService.saveemployee(employee);
      return employee;  // Return the read employee or any response you prefer
    } catch (error) {
      console.error("[EmployeeController] [uploadExcel] error:", error);
      throw new BadRequestException(error.message);      
    }
  }
}
