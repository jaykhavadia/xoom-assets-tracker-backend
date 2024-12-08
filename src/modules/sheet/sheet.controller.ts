import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { Sheet } from './entities/sheet.entity';
import { Messages } from 'src/constants/messages.constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sheet')
@UseGuards(JwtAuthGuard)
export class SheetController {
  private readonly logger = new Logger(SheetController.name);

  constructor(private readonly sheetService: SheetService) {}

  // Create a new sheet
  @Post()
  async create(
    @Body(new ValidationPipe()) sheet: Sheet,
  ): Promise<response<Sheet>> {
    try {
      const response = await this.sheetService.create(sheet);
      return {
        success: true,
        message: Messages.sheet.createSuccess,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[SheetController] [create] Error: ${error.message}`);
      throw new HttpException(Messages.sheet.createFailure, HttpStatus.BAD_REQUEST);
    }
  }

  // Get all sheets
  @Get()
  async findAll(): Promise<response<Sheet[]>> {
    try {
      const response = await this.sheetService.findAll();
      return {
        success: true,
        message: Messages.sheet.findAllSuccess,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[SheetController] [findAll] Error: ${error.message}`);
      throw new HttpException(Messages.sheet.findAllFailure, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get a sheet by ID
  @Get(':id')
  async findOne(
    @Param('id') id: string, // Get id as string
  ): Promise<response<Sheet>> {
    const sheetId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.sheetService.findOne(sheetId);
      if (!response) {
        throw new HttpException(Messages.sheet.findOneFailure(sheetId), HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: Messages.sheet.findOneSuccess(sheetId),
        data: response,
      };
    } catch (error) {
      this.logger.error(`[SheetController] [findOne] Error: ${error.message}`);
      throw new HttpException(Messages.sheet.findOneFailure(sheetId), HttpStatus.NOT_FOUND);
    }
  }

  // Update a sheet by ID
  @Put(':id')
  async update(
    @Param('id') id: string, // Get id as string
    @Body(new ValidationPipe()) sheet: Sheet,
  ): Promise<response<Sheet>> {
    const sheetId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.sheetService.update(sheetId, sheet);
      return {
        success: true,
        message: Messages.sheet.updateSuccess(sheetId),
        data: response,
      };
    } catch (error) {
      this.logger.error(`[SheetController] [update] Error: ${error.message}`);
      throw new HttpException(Messages.sheet.updateFailure(sheetId), HttpStatus.BAD_REQUEST);
    }
  }

  // Delete a sheet by ID
  @Delete(':id')
  async remove(
    @Param('id') id: string, // Get id as string
  ): Promise<response<void>> {
    const sheetId = parseInt(id, 10); // Convert to number
    try {
      await this.sheetService.remove(sheetId);
      return {
        success: true,
        message: Messages.sheet.removeSuccess(sheetId),
      };
    } catch (error) {
      this.logger.error(`[SheetController] [remove] Error: ${error.message}`);
      throw new HttpException(Messages.sheet.removeFailure(sheetId), HttpStatus.BAD_REQUEST);
    }
  }
}
