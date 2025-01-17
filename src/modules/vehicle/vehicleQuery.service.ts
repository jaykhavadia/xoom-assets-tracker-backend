import { Vehicle } from "src/modules/vehicle/entities/vehical.entity";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class VehicleQueryService {
  private readonly logger = new Logger(VehicleQueryService.name);
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>, // Inject your vehicle repository
  ) {}

  async findVehicleCountByModelAndAggregator(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.model", "m") // Join with model
        .innerJoinAndSelect("v.aggregator", "a") // Join with aggregator
        .select(["m.brand AS model", "a.name AS aggregator"])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("m.brand, a.name") // Group by model and aggregator
        .orderBy("m.brand"); // Order by model

      const result = await queryBuilder.getRawMany();

      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByModelAndAggregator] Error: ${error.message}`,
      );
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findVehicleCountByAggregatorAndModel(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.model", "m") // Join with model
        .innerJoinAndSelect("v.aggregator", "a") // Join with aggregator
        .select(["a.name AS aggregator", "m.brand AS model"])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("a.name, m.brand") // Group by aggregator and model
        .orderBy("a.name"); // Order by aggregator

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByAggregatorAndModel] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findVehicleCountByOwnerAndAggregator(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.ownedBy", "o") // Join with OwnedBy entity
        .innerJoinAndSelect("v.aggregator", "a") // Join with Aggregator entity
        .select(["o.name AS owned_by", "a.name AS aggregator"])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("o.name, a.name") // Group by OwnedBy and Aggregator
        .orderBy("o.name");

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByOwnerAndAggregator] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findVehicleCountByAggregatorAndCategory(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.vehicleType", "vt") // Join with VehicleType entity
        .innerJoinAndSelect("v.aggregator", "a") // Join with Aggregator entity
        .select([
          "a.name AS aggregator",
          "vt.name AS category",
          "vt.fuel as fuel",
        ])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("a.name, vt.name, vt.fuel") // Group by Aggregator and VehicleType
        .orderBy("a.name"); // Order by Aggregator

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByAggregatorAndCategory] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findVehicleCountByAggregatorEmiratesAndCategory(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.vehicleType", "vt") // Join with VehicleType entity
        .innerJoinAndSelect("v.aggregator", "a") // Join with Aggregator entity
        .select([
          "a.name AS aggregator",
          "v.emirates AS emirates",
          "vt.name AS category",
          "vt.fuel as fuel",
        ])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("a.name, v.emirates, vt.name, vt.fuel") // Group by Aggregator and VehicleType
        .orderBy("a.name");
      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByAggregatorEmiratesAndCategory] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findVehicleCountByEmiratesAndCategory(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.vehicleType", "vt") // Join with VehicleType entity
        .select([
          "v.emirates AS emirates",
          "vt.name AS category",
          "vt.fuel AS fuel",
        ])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("v.emirates, vt.name, vt.fuel") // Group by Emirates, VehicleType name, and Fuel
        .orderBy("v.emirates"); // Order by Aggregator

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByEmiratesAndCategoryFuel] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findVehicleCountByEmiratesAndOwnedBy(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.ownedBy", "ob") // Join with OwnedBy entity
        .select(["v.emirates AS emirates", "ob.name AS owned_by"])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("v.emirates, ob.name") // Group by Emirates and OwnedBy name
        .orderBy("v.emirates");

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findVehicleCountByEmiratesAndOwnedBy] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findCategoryOperationByEmirates(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.ownedBy", "ob") // Join with OwnedBy entity
        .innerJoinAndSelect("v.vehicleType", "vt") // Join with VehicleType entity
        .innerJoinAndSelect("v.aggregator", "a") // Join with Aggregator entity
        .select([
          "v.emirates AS emirates",
          "ob.name AS owned_by",
          "vt.name AS category",
          "vt.fuel AS fuel",
          "a.name AS aggregator",
        ])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("v.emirates, ob.name, vt.name, vt.fuel, a.name"); // Group by required fields

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findCategoryOperationByEmirates] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findEmiratesCategoryCount(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.ownedBy", "ob") // Join with OwnedBy entity
        .innerJoinAndSelect("v.vehicleType", "vt") // Join with VehicleType entity
        .select([
          "v.emirates AS emirates",
          "ob.name AS owned_by",
          "vt.name AS category",
          "vt.fuel AS fuel",
        ])
        .addSelect("COUNT(v.id)", "vehicle_count")
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("v.emirates, ob.name, vt.name, vt.fuel") // Group by required fields
        .orderBy("v.emirates");

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findEmiratesCategoryCount] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  async findExpiryStatus(): Promise<any> {
    try {
      const queryBuilder = this.vehicleRepository
        .createQueryBuilder("v")
        .innerJoinAndSelect("v.model", "m") // Join with Model entity
        .select([
          "v.emirates AS emirates",
          "m.brand AS model",
          "COUNT(v.id) AS vehicle_count",
          `CASE 
            WHEN MAX(v.registrationExpiry) < CURRENT_DATE THEN 'Expired'
            WHEN MAX(v.registrationExpiry) BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY) THEN 'Near To Expire'
            ELSE 'Valid'
          END AS status`,
        ])
        .where("v.isDeleted = :isDeleted", { isDeleted: false })
        .groupBy("v.emirates, m.brand") // Group by required fields
        .orderBy("v.emirates");

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      this.logger.error(
        `[VehicleQueryService] [findExpiryStatus] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }
}
