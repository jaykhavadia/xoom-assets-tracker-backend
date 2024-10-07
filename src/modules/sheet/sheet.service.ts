import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sheet } from './entities/sheet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SheetService {
  private readonly logger = new Logger(SheetService.name); // Logger with class name

  constructor(
    @InjectRepository(Sheet)
    private sheetRepository: Repository<Sheet>,
  ) { }

  /**
   * Creates a new sheet entry in the database
   * @param sheet - the sheet object to be created
   * @returns the created sheet
   */
  async create(sheet: Partial<Sheet>): Promise<Sheet> {
    try {
      return await this.sheetRepository.save(sheet);
    } catch (error) {
      this.logger.error(`[SheetService] [create] Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to create sheet.');
    }
  }

  /**
   * Retrieves all sheets from the database
   * @returns an array of sheets
   */
  async findAll(): Promise<Sheet[]> {
    try {
      return await this.sheetRepository.find();
    } catch (error) {
      this.logger.error(`[SheetService] [findAll] Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve sheets.');
    }
  }

  /**
   * Retrieves a sheet by its ID
   * @param id - the ID of the sheet to retrieve
   * @returns the found sheet
   */
  async findOne(id: number): Promise<Sheet> {
    try {
      return await this.sheetRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(`[SheetService] [findOne] Error: ${error.message}`);
      throw new InternalServerErrorException(`Failed to find sheet with id: ${id}`);
    }
  }

  /**
   * Updates an existing sheet in the database
   * @param id - the ID of the sheet to update
   * @param sheet - the sheet object with updated information
   * @returns the updated sheet
   */
  async update(id: number, sheet: Sheet): Promise<Sheet> {
    try {
      await this.sheetRepository.update(id, sheet);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`[SheetService] [update] Error: ${error.message}`);
      throw new InternalServerErrorException(`Failed to update sheet with id: ${id}`);
    }
  }

  /**
   * Removes a sheet by its ID
   * @param id - the ID of the sheet to remove
   */
  async remove(id: number): Promise<void> {
    try {
      let sheet = await this.findOne(id);
      if (!sheet) {
        throw new InternalServerErrorException(`No data with id: ${id}`);
      }
      await this.sheetRepository.delete(id);
    } catch (error) {
      this.logger.error(`[SheetService] [remove] Error: ${error.message}`);
      throw new InternalServerErrorException(`Failed to delete sheet with id: ${id}`);
    }
  }
}
