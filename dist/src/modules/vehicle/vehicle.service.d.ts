import { Vehicle } from "./entities/vehical.entity";
import { Repository } from "typeorm";
import { VehicleDto } from "./dto/create-vehicle.dto";
import { VehicleType } from "../vehicle-type/entities/vehicle-type.entity";
import { Model } from "../model/entities/model.entity";
import { Aggregator } from "../aggregator/entities/aggregator.entity";
import { OwnedBy } from "../owned-by/entities/owned_by.entity";
import { Transaction } from "../transaction/entities/transaction.entity";
export declare class VehicleService {
    private vehicleRepository;
    private readonly vehicleTypeRepository;
    private readonly modelRepository;
    private readonly aggregatorRepository;
    private readonly ownedByRepository;
    private transactionRepository;
    private readonly logger;
    constructor(vehicleRepository: Repository<Vehicle>, vehicleTypeRepository: Repository<VehicleType>, modelRepository: Repository<Model>, aggregatorRepository: Repository<Aggregator>, ownedByRepository: Repository<OwnedBy>, transactionRepository: Repository<Transaction>);
    create(createVehicleDto: VehicleDto): Promise<Vehicle>;
    findAll(status?: "available" | "occupied"): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    findByVehicleNo(vehicleNo: string): Promise<Vehicle>;
    update(id: string, updateVehicleDto: VehicleDto): Promise<Vehicle>;
    remove(id: string): Promise<void>;
    updateVehicles(vehicles: Vehicle[]): Promise<void>;
    checkRelation(checkRelationDto: VehicleDto): Promise<{
        vehicleType: VehicleType;
        model: Model;
        ownedBy: OwnedBy;
        aggregator: Aggregator;
    }>;
    getFilteredVehicles(model?: string, ownedBy?: string, vehicleType?: string, aggregatorName?: string): Promise<any>;
    getVehicleCountByAggregator(): Promise<any[]>;
    getVehicleCountByModel(): Promise<any[]>;
    getVehicleCountByOwner(): Promise<any[]>;
    getVehicleCountByType(): Promise<any[]>;
    getVehiclesByLocationName(locationName: string): Promise<Vehicle[]>;
}
