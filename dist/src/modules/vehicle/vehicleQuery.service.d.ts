import { Vehicle } from "src/modules/vehicle/entities/vehical.entity";
import { Repository } from "typeorm";
export declare class VehicleQueryService {
    private vehicleRepository;
    private readonly logger;
    constructor(vehicleRepository: Repository<Vehicle>);
    findVehicleCountByModelAndAggregator(): Promise<any>;
    findVehicleCountByAggregatorAndModel(): Promise<any>;
    findVehicleCountByOwnerAndAggregator(): Promise<any>;
    findVehicleCountByAggregatorAndCategory(): Promise<any>;
    findVehicleCountByAggregatorEmiratesAndCategory(): Promise<any>;
    findVehicleCountByEmiratesAndCategory(): Promise<any>;
    findVehicleCountByEmiratesAndOwnedBy(): Promise<any>;
    findCategoryOperationByEmirates(): Promise<any>;
    findEmiratesCategoryCount(): Promise<any>;
    findExpiryStatus(): Promise<any>;
}
