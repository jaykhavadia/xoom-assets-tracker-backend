import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>, // Inject Location repository
  ) { }

  /**
   * Creates a new location in the database.
   * @param location - The location object to be created.
   * @returns The created location object.
   */
  async create(location: Location): Promise<Location> {
    try {
      const newLocation = this.locationRepository.create(location); // Create a new Location instance
      return await this.locationRepository.save(newLocation); // Save the instance in the database
    } catch (error) {
      console.error("[LocationService] [create] error:", error)
      // error and throw a more specific error message
      throw new InternalServerErrorException(
        error.message,
      );
    }
  }

  /**
   * Retrieves all locations from the database.
   * @returns An array of all location entities.
   */
  async findAll(): Promise<Location[]> {
    try {
      return await this.locationRepository.find(); // Find and return all locations
    } catch (error) {
      // error and throw a more specific error message
      throw new InternalServerErrorException(
        `[LocationService] [findAll] Error: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves a single location by ID.
   * @param id - The ID of the location to retrieve.
   * @returns The location entity or throws a NotFoundException if not found.
   */
  async findOne(id: number): Promise<Location> {
    try {
      const location = await this.locationRepository.findOne({ where: { id } }); // Find a location by ID
      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`); // Throw if location doesn't exist
      }
      return location;
    } catch (error) {
      // error and throw a more specific error message
      throw new InternalServerErrorException(
        `[LocationService] [findOne] Error: ${error.message}`,
      );
    }
  }

  async findByName(name: string): Promise<Location> {
    try {
      const location = await this.locationRepository.findOne({ where: { name } }); // Find a location by ID
      if (!location) {
        throw new NotFoundException(`Location with name ${name} not found`); // Throw if location doesn't exist
      }
      return location;
    } catch (error) {
      // error and throw a more specific error message
      throw new InternalServerErrorException(
        `[LocationService] [findOne] Error: ${error.message}`,
      );
    }
  }

  /**
   * Updates a location by its ID.
   * @param id - The ID of the location to update.
   * @param location - The updated location data.
   * @returns The updated location entity.
   */
  async update(id: number, location: Location): Promise<Location> {
    try {
      const existingLocation = await this.findOne(id); // Check if the location exists
      if (!existingLocation) {
        throw new NotFoundException(`Location with ID ${id} not found`); // If not found, throw exception
      }
      await this.locationRepository.update(id, location); // Update the location data
      return await this.findOne(id); // Return the updated location
    } catch (error) {
      console.error("[LocationService] [update] error:", error)
      // Log and throw a more specific error message
      throw new InternalServerErrorException(
        error.message,
      );
    }
  }

  /**
   * Deletes a location by its ID.
   * @param id - The ID of the location to delete.
   * @returns A promise that resolves when the location is deleted.
   */
  async remove(id: number): Promise<void> {
    try {
      const location = await this.findOne(id); // Ensure the location exists
      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`); // If not found, throw exception
      }
      await this.locationRepository.delete(id); // Delete the location
    } catch (error) {
      // Log and throw a more specific error message
      throw new InternalServerErrorException(
        `[LocationService] [remove] Error: ${error.message}`,
      );
    }
  }
}
