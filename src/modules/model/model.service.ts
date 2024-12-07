// src/modules/model/model.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { Messages } from 'src/constants/messages.constants';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) { }

  async create(model: Partial<Model>) {
    try {
      const newModel = this.modelRepository.create(model);
      return await this.modelRepository.save(newModel);
    } catch (error) {
      this.logger.error('[ModelService] [create] Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.modelRepository.find();
    } catch (error) {
      this.logger.error('[ModelService] [findAll] Error:', error);
      throw new HttpException(Messages.model.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.modelRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error('[ModelService] [findOne] Error:', error);
      throw new HttpException(Messages.model.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateData: Partial<Model>) {
    try {
      await this.modelRepository.update(id, updateData);
      return this.findOne(id);
    } catch (error) {
      this.logger.error('[ModelService] [update] Error:', error);
      throw new HttpException(Messages.model.updateFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.modelRepository.delete(id);
      return { message: 'Model deleted successfully.' };
    } catch (error) {
      this.logger.error('[ModelService] [remove] Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
