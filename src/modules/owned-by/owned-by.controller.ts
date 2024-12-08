// src/modules/ownedBy/ownedBy.controller.ts
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
} from '@nestjs/common';
import { OwnedByService } from './owned-by.service';
import { OwnedBy } from './entities/owned_by.entity';

@Controller('owned-by')
export class OwnedByController {
  private readonly logger = new Logger(OwnedByController.name);

  constructor(private readonly ownedByService: OwnedByService) { }

  // Endpoint for creating a new ownedBy record
  @Post()
  async create(@Body() ownedBy: Partial<OwnedBy>): Promise<response<OwnedBy>> {
    try {
      const response = await this.ownedByService.create(ownedBy);
      return {
        success: true,
        message: 'OwnedBy record created successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[OwnedByController] [create] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving all ownedBy records
  @Get()
  async findAll(): Promise<response<OwnedBy[]>> {
    try {
      const response = await this.ownedByService.findAll();
      return {
        success: true,
        message: 'OwnedBy records retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[OwnedByController] [findAll] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving a specific ownedBy record by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<response<OwnedBy>> {
    try {
      const response = await this.ownedByService.findOne(id);
      return {
        success: true,
        message: 'OwnedBy record retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[OwnedByController] [findOne] Error: ${error.message}`);
      throw new HttpException('Failed to retrieve ownedBy record.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for updating a specific ownedBy record by ID
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<OwnedBy>): Promise<response<OwnedBy>> {
    try {
      const response = await this.ownedByService.update(id, updateData);
      return {
        success: true,
        message: 'OwnedBy record updated successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[OwnedByController] [update] Error: ${error.message}`);
      throw new HttpException('Failed to update ownedBy record.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for deleting a specific ownedBy record by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<response<null>> {
    try {
      await this.ownedByService.remove(id);
      return {
        success: true,
        message: 'OwnedBy record removed successfully.',
        data: null,
      };
    } catch (error) {
      this.logger.error(`[OwnedByController] [remove] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
