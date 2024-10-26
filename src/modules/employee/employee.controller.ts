import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Employee } from './entities/employee.entity';
import { UploadService } from 'src/common/upload/upload.service';
import { Messages } from 'src/constants/messages.constants';
import { Sheet } from '../sheet/entities/sheet.entity';
import { format } from 'date-fns';
import { SheetService } from '../sheet/sheet.service';
import { GoogleDriveService } from 'src/common/google-drive/google-drive.service';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

@Controller('employee')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly uploadService: UploadService,
    private readonly sheetService: SheetService,
    private readonly googleDriveService: GoogleDriveService,
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

      // Prepare data for the Sheet entity
      const sheetData: Partial<Sheet> = {
        uploadedAt: new Date(), // Current date and time
        uploadedAtTime: format(new Date(), 'hh:mm a'), // Format the time as '10:30 AM'
        fileUrl: file.originalname, // Assuming the file path is stored in 'file.path'
        type: 'Employee', // Assuming the file path is stored in 'file.path'
      };

      // Save the Sheet entry to the database
      const sheetDetails = await this.sheetService.create(sheetData); // Create a new Sheet entry
      const sheetId = sheetDetails.id;
      // The ID of the parent folder where the new folder should be created
      const parentFolderId = '1ksRPuN_aGdLS7NeRKdbH7br1E1vaB7Nl'; // Replace with your folder ID

      // Create the folder named {sheetId} inside the specified parent folder
      const sheetFolderId = await this.googleDriveService.getOrCreateFolder(sheetId.toString(), parentFolderId);

      const directoryPath = path.join('src', 'uploads', 'employee');
      const fileName = file.originalname;
      // Ensure the directory exists (create it recursively if it doesn't)
      mkdirp.sync(directoryPath);
      // Write the image data to the file
      const filePath = path.join(directoryPath, fileName);
      fs.writeFileSync(filePath, file.buffer);

      console.log("Checking if file exists at:", filePath);
      if (!fs.existsSync(filePath)) {
        console.error("File does not exist:", filePath);
        throw new Error("File not found");
      }
      await this.googleDriveService.uploadFile(filePath, sheetFolderId);
      // Clean up the temporary file after uploading
      await fs.promises.unlink(filePath);

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
