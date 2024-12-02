// src/modules/aggregator/aggregator.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Logger } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { Aggregator } from './entities/aggregator.entity';

@Controller('aggregator')
export class AggregatorController {
  private readonly logger = new Logger(AggregatorController.name);

  constructor(private readonly aggregatorService: AggregatorService) {}

  @Post()
  async create(@Body() aggregator: Partial<Aggregator>) {
    try {
      return await this.aggregatorService.create(aggregator);
    } catch (error) {
      this.logger.error('[AggregatorController] [create] Error:', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.aggregatorService.findAll();
    } catch (error) {
      this.logger.error('[AggregatorController] [findAll] Error:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.aggregatorService.findOne(id);
    } catch (error) {
      this.logger.error('[AggregatorController] [findOne] Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Aggregator>) {
    try {
      return await this.aggregatorService.update(id, updateData);
    } catch (error) {
      this.logger.error('[AggregatorController] [update] Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.aggregatorService.remove(id);
    } catch (error) {
      this.logger.error('[AggregatorController] [remove] Error:', error);
      throw error;
    }
  }
}
