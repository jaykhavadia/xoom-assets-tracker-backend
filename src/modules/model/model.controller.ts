// src/modules/model/model.controller.ts
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
  UseGuards,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { Model } from './entities/model.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('model')
@UseGuards(JwtAuthGuard)
export class ModelController {
  private readonly logger = new Logger(ModelController.name);

  constructor(private readonly modelService: ModelService) {}

  // Endpoint for creating a new model
  @Post()
  async create(@Body() model: Partial<Model>): Promise<response<Model>> {
    try {
      const response = await this.modelService.create(model);
      return {
        success: true,
        message: 'Model created successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[ModelController] [create] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving all models
  @Get()
  async findAll(): Promise<response<Model[]>> {
    try {
      const response = await this.modelService.findAll();
      return {
        success: true,
        message: 'Models retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[ModelController] [findAll] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving a specific model by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<response<Model>> {
    try {
      const response = await this.modelService.findOne(id);
      return {
        success: true,
        message: 'Model retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[ModelController] [findOne] Error: ${error.message}`);
      throw new HttpException('Failed to retrieve model.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for updating a specific model by ID
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Model>): Promise<response<Model>> {
    try {
      const response = await this.modelService.update(id, updateData);
      return {
        success: true,
        message: 'Model updated successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[ModelController] [update] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for deleting a specific model by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<response<null>> {
    try {
      await this.modelService.remove(id);
      return {
        success: true,
        message: 'Model removed successfully.',
        data: null,
      };
    } catch (error) {
      this.logger.error(`[ModelController] [remove] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}