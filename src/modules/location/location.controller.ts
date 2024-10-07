import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';

@Controller('location')
export class LocationController {
  private readonly logger = new Logger(LocationController.name); // Initialize logger

  constructor(
    private readonly locationService: LocationService,
  ) { }

  /**
   * Create a new location
   * @param location - The location data
   * @returns The created location object or an error message
   */
  @Post()
  async create(
    @Body(new ValidationPipe()) location: Location
  ): Promise<{ success: boolean; message: string; data?: Location }> {
    try {
      const response = await this.locationService.create(location);
      return {
        success: true,
        message: 'Location created successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[LocationController] [create] Error: ${error.message}`);
      throw new HttpException('Failed to create location', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Retrieve all locations
   * @returns The list of locations or an error message
   */
  @Get()
  async findAll(): Promise<{ success: boolean; message: string; data?: Location[] }> {
    try {
      const response = await this.locationService.findAll();
      return {
        success: true,
        message: 'Locations retrieved successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error(`[LocationController] [findAll] Error: ${error.message}`);
      throw new HttpException('Failed to retrieve locations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieve a location by its ID
   * @param id - The ID of the location
   * @returns The location object or an error message
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string // ID as a string
  ): Promise<{ success: boolean; message: string; data?: Location }> {
    const locationId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.locationService.findOne(locationId);
      if (!response) {
        throw new HttpException(`Location with ID ${locationId} not found`, HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: `Location with ID ${locationId} retrieved successfully`,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[LocationController] [findOne] Error: ${error.message}`);
      throw new HttpException(`Failed to retrieve location with ID ${locationId}`, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Update a location by its ID
   * @param id - The ID of the location
   * @param location - The updated location data
   * @returns The updated location or an error message
   */
  @Put(':id')
  async update(
    @Param('id') id: string, // ID as a string
    @Body(new ValidationPipe()) location: Location
  ): Promise<{ success: boolean; message: string; data?: Location }> {
    const locationId = parseInt(id, 10); // Convert to number
    try {
      const response = await this.locationService.update(locationId, location);
      return {
        success: true,
        message: `Location with ID ${locationId} updated successfully`,
        data: response,
      };
    } catch (error) {
      this.logger.error(`[LocationController] [update] Error: ${error.message}`);
      throw new HttpException(`Failed to update location with ID ${locationId}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Delete a location by its ID
   * @param id - The ID of the location
   * @returns A success message or an error message
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string // ID as a string
  ): Promise<{ success: boolean; message: string }> {
    const locationId = parseInt(id, 10); // Convert to number
    try {
      await this.locationService.remove(locationId);
      return {
        success: true,
        message: `Location with ID ${locationId} removed successfully`,
      };
    } catch (error) {
      this.logger.error(`[LocationController] [remove] Error: ${error.message}`);
      throw new HttpException(`Failed to remove location with ID ${locationId}`, HttpStatus.BAD_REQUEST);
    }
  }
}
