// src/modules/model/model.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Logger } from '@nestjs/common';
import { ModelService } from './model.service';
import { Model } from './entities/model.entity';

@Controller('model')
export class ModelController {
  private readonly logger = new Logger(ModelController.name);

  constructor(private readonly modelService: ModelService) { }

  @Post()
  async create(@Body() model: Partial<Model>) {
    try {
      return await this.modelService.create(model);
    } catch (error) {
      this.logger.error('[ModelController] [create] Error:', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.modelService.findAll();
    } catch (error) {
      this.logger.error('[ModelController] [findAll] Error:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.modelService.findOne(id);
    } catch (error) {
      this.logger.error('[ModelController] [findOne] Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Model>) {
    try {
      return await this.modelService.update(id, updateData);
    } catch (error) {
      this.logger.error('[ModelController] [update] Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.modelService.remove(id);
    } catch (error) {
      this.logger.error('[ModelController] [remove] Error:', error);
      throw error;
    }
  }
}
