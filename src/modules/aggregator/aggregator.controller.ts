// src/modules/aggregator/aggregator.controller.ts
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
import { AggregatorService } from './aggregator.service';
import { Aggregator } from './entities/aggregator.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('aggregator')
@UseGuards(JwtAuthGuard)
export class AggregatorController {
  private readonly logger = new Logger(AggregatorController.name);

  constructor(private readonly aggregatorService: AggregatorService) {}

  // Endpoint for creating a new aggregator
  @Post()
  async create(@Body() aggregator: Partial<Aggregator>): Promise<response<Aggregator>> {
    try {
      const response = await this.aggregatorService.create(aggregator);
      return {
        success: true,
        message: 'Aggregator created successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[AggregatorController] [create] Error: ${error.message}`);
      throw new HttpException('Failed to create aggregator.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving all aggregators
  @Get()
  async findAll(): Promise<response<Aggregator[]>> {
    try {
      const response = await this.aggregatorService.findAll();
      return {
        success: true,
        message: 'Aggregators retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[AggregatorController] [findAll] Error: ${error.message}`);
      throw new HttpException('Failed to retrieve aggregators.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for retrieving a specific aggregator by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<response<Aggregator>> {
    try {
      const response = await this.aggregatorService.findOne(id);
      return {
        success: true,
        message: 'Aggregator retrieved successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[AggregatorController] [findOne] Error: ${error.message}`);
      throw new HttpException('Failed to retrieve aggregator.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for updating a specific aggregator by ID
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Aggregator>): Promise<response<Aggregator>> {
    try {
      const response = await this.aggregatorService.update(id, updateData);
      return {
        success: true,
        message: 'Aggregator updated successfully.',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[AggregatorController] [update] Error: ${error.message}`);
      throw new HttpException('Failed to update aggregator.', HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for deleting a specific aggregator by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<response<null>> {
    try {
      await this.aggregatorService.remove(id);
      return {
        success: true,
        message: 'Aggregator removed successfully.',
        data: null,
      };
    } catch (error) {
      this.logger.error(`[AggregatorController] [remove] Error: ${error.message}`);
      throw new HttpException('Failed to remove aggregator.', HttpStatus.BAD_REQUEST);
    }
  }
}
