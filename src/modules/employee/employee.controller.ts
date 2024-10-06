import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Employee } from './entities/employee.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { Messages } from 'src/constants/messages.constants';

@Controller('employee')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name); // Logger with class name

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly uploadService: UploadService
  ) { }

  @Post()
  async create(
    @Body() employee: Employee
  ): Promise<{ success: boolean; message: string; data?: Employee }> {
    try {
      const response = await this.employeeService.create(employee);
      return {
        success: true,
        message: Messages.employee.createSuccess, // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [create] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.employee.createFailure,
      };
    }
  }

  @Get()
  async findAll(): Promise<{ success: boolean; message: string; data?: Employee[] }> {
    try {
      const response = await this.employeeService.findAll();
      return {
        success: true,
        message: Messages.employee.findAllSuccess, // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [findAll] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.employee.findAllFailure,
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ): Promise<{ success: boolean; message: string; data?: Employee }> {
    try {
      const response = await this.employeeService.findOne(id);
      return {
        success: true,
        message: Messages.employee.findOneSuccess(id), // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [findOne] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.employee.findOneFailure(id), // Using constant message
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() employee: Employee
  ): Promise<{ success: boolean; message: string; data?: Employee }> {
    try {
      const response = await this.employeeService.update(id, employee);
      return {
        success: true,
        message: Messages.employee.updateSuccess(id), // Using constant message
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [update] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.employee.updateFailure(id), // Using constant message
      };
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.employeeService.remove(id);
      return {
        success: true,
        message: Messages.employee.removeSuccess(id), // Using constant message
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [remove] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.employee.removeFailure(id), // Using constant message
      };
    }
  }

  /**
   * Endpoint to clear the employee table and insert new data
   * @param employees - array of new employees to be inserted
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<{ success: boolean; message: string }> {
    try {
      const employee = await this.uploadService.readExcel(file, 'employee');
      console.log("🚀 ~ VehicleController ~ uploadExcel ~ employee:", employee)
      return {
        success: true,
        message: Messages.employee.updateBulkSuccess, // Using constant message
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [updateEmployees] Error: ${error.message}`);
      return {
        success: false,
        message: Messages.employee.updateBulkFailure,
      };
    }
  }
}
