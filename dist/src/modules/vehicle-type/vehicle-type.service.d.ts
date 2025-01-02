import { Repository } from 'typeorm';
import { VehicleType } from './entities/vehicle-type.entity';
export declare class VehicleTypeService {
    private readonly vehicleTypeRepository;
    private readonly logger;
    constructor(vehicleTypeRepository: Repository<VehicleType>);
    create(vehicleType: Partial<VehicleType>): Promise<VehicleType>;
    findAll(name?: string, fuel?: string): Promise<VehicleType[]>;
    findOne(id: number): Promise<VehicleType>;
    update(id: number, updateData: Partial<VehicleType>): Promise<VehicleType>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
