// src/modules/ownedBy/ownedBy.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Logger } from '@nestjs/common';
import { OwnedByService } from './owned-by.service';
import { OwnedBy } from './entities/owned_by.entity';

@Controller('owned-by')
export class OwnedByController {
  private readonly logger = new Logger(OwnedByController.name);

  constructor(private readonly ownedByService: OwnedByService) { }

  @Post()
  async create(@Body() ownedBy: Partial<OwnedBy>) {
    try {
      return await this.ownedByService.create(ownedBy);
    } catch (error) {
      this.logger.error('[OwnedByController] [create] Error:', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.ownedByService.findAll();
    } catch (error) {
      this.logger.error('[OwnedByController] [findAll] Error:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.ownedByService.findOne(id);
    } catch (error) {
      this.logger.error('[OwnedByController] [findOne] Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<OwnedBy>) {
    try {
      return await this.ownedByService.update(id, updateData);
    } catch (error) {
      this.logger.error('[OwnedByController] [update] Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.ownedByService.remove(id);
    } catch (error) {
      this.logger.error('[OwnedByController] [remove] Error:', error);
      throw error;
    }
  }
}
