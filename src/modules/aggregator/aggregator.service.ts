// src/modules/aggregator/aggregator.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aggregator } from './entities/aggregator.entity';
import { Messages } from 'src/constants/messages.constants';

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    @InjectRepository(Aggregator)
    private readonly aggregatorRepository: Repository<Aggregator>,
  ) {}

  async create(aggregator: Partial<Aggregator>) {
    try {
      const newAggregator = this.aggregatorRepository.create(aggregator);
      return await this.aggregatorRepository.save(newAggregator);
    } catch (error) {
      this.logger.error('[AggregatorService] [create] Error:', error);
      throw new HttpException(Messages.aggregator.createFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.aggregatorRepository.find();
    } catch (error) {
      this.logger.error('[AggregatorService] [findAll] Error:', error);
      throw new HttpException(Messages.aggregator.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.aggregatorRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error('[AggregatorService] [findOne] Error:', error);
      throw new HttpException(Messages.aggregator.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateData: Partial<Aggregator>) {
    try {
      await this.aggregatorRepository.update(id, updateData);
      return this.findOne(id);
    } catch (error) {
      this.logger.error('[AggregatorService] [update] Error:', error);
      throw new HttpException(Messages.aggregator.updateFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.aggregatorRepository.delete(id);
      return { message: 'Aggregator deleted successfully.' };
    } catch (error) {
      this.logger.error('[AggregatorService] [remove] Error:', error);
      throw new HttpException(Messages.aggregator.deleteFailure, HttpStatus.BAD_REQUEST);
    }
  }
}
