import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Employee } from './entities/employee.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { Messages } from 'src/constants/messages.constants';

@Controller('employee')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly uploadService: UploadService,
  ) { }

  @Post()
  async create(
    @Body(new ValidationPipe()) employee: Employee
  ): Promise<response<Employee>> {
    try {
      const response = await this.employeeService.create(employee);
      return {
        success: true,
        message: Messages.employee.createSuccess,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [create] Error: ${error.message}`);
      throw new HttpException(Messages.employee.createFailure, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<response<Employee[]>> {
    try {
      const response = await this.employeeService.findAll();
      return {
        success: true,
        message: Messages.employee.findAllSuccess,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [findAll] Error: ${error.message}`);
      throw new HttpException(Messages.employee.findAllFailure, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string // Get id as string
  ): Promise<response<Employee>> {
    const employeeId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.employeeService.findOne(employeeId);
      if (!response) {
        throw new HttpException(Messages.employee.findOneFailure(employeeId), HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: Messages.employee.findOneSuccess(employeeId),
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [findOne] Error: ${error.message}`);
      throw new HttpException(Messages.employee.findOneFailure(employeeId), HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string, // Get id as string
    @Body(new ValidationPipe()) employee: Employee
  ): Promise<response<Employee>> {
    const employeeId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.employeeService.update(employeeId, employee);
      return {
        success: true,
        message: Messages.employee.updateSuccess(employeeId),
        data: response,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [update] Error: ${error.message}`);
      throw new HttpException(Messages.employee.updateFailure(employeeId), HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string // Get id as string
  ): Promise<response<void>> {
    const employeeId = parseInt(id, 10); // Convert to number
    try {
      await this.employeeService.remove(employeeId);
      return {
        success: true,
        message: Messages.employee.removeSuccess(employeeId),
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [remove] Error: ${error.message}`);
      throw new HttpException(Messages.employee.removeFailure(employeeId), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint to upload employees from an Excel file.
   * @param file - The Excel file containing employee data.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<response<void>> {
    try {
      const employees = await this.uploadService.readExcel(file, 'employee');
      // Save employees to the database (this part needs to be implemented in the service)
      await this.employeeService.updateEmployees(employees as Employee[]); // Assuming you have a createBulk method
      return {
        success: true,
        message: Messages.employee.updateBulkSuccess,
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [uploadExcel] Error: ${error.message}`);
      throw new HttpException(Messages.employee.updateBulkFailure, HttpStatus.BAD_REQUEST);
    }
  }
}
