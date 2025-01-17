import { Repository } from "typeorm";
import { Vehicle } from "../vehicle/entities/vehical.entity";
export declare class TransactionQueryService {
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
