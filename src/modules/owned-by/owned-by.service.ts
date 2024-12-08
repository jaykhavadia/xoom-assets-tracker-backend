// src/modules/ownedBy/ownedBy.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnedBy } from './entities/owned_by.entity';
import { Messages } from 'src/constants/messages.constants';

@Injectable()
export class OwnedByService {
  private readonly logger = new Logger(OwnedByService.name);

  constructor(
    @InjectRepository(OwnedBy)
    private readonly ownedByRepository: Repository<OwnedBy>,
  ) { }

  async create(ownedBy: Partial<OwnedBy>) {
    try {
      const newOwnedBy = this.ownedByRepository.create(ownedBy);
      return await this.ownedByRepository.save(newOwnedBy);
    } catch (error) {
      this.logger.error('[OwnedByService] [create] Error:', error);
      throw new HttpException(error.Messages, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.ownedByRepository.find();
    } catch (error) {
      this.logger.error('[OwnedByService] [findAll] Error:', error);
      throw new HttpException(Messages.ownedBy.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.ownedByRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error('[OwnedByService] [findOne] Error:', error);
      throw new HttpException(Messages.ownedBy.fetchFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateData: Partial<OwnedBy>) {
    try {
      await this.ownedByRepository.update(id, updateData);
      return this.findOne(id);
    } catch (error) {
      this.logger.error('[OwnedByService] [update] Error:', error);
      throw new HttpException(Messages.ownedBy.updateFailure, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.ownedByRepository.delete(id);
      return { message: 'OwnedBy deleted successfully.' };
    } catch (error) {
      this.logger.error('[OwnedByService] [remove] Error:', error);
      throw new HttpException(error.Messages, HttpStatus.BAD_REQUEST);
    }
  }
}
