import { VehicleTypeService } from './vehicle-type.service';
import { Fuel, VehicleType } from './entities/vehicle-type.entity';
export declare class VehicleTypeController {
    private readonly vehicleTypeService;
    private readonly logger;
    constructor(vehicleTypeService: VehicleTypeService);
    create(vehicleType: VehicleType): Promise<response<VehicleType>>;
    findAll(name?: string, fuel?: Fuel): Promise<response<VehicleType[]>>;
    findOne(id: number): Promise<response<VehicleType>>;
    update(id: number, updateData: Partial<VehicleType>): Promise<response<VehicleType>>;
    remove(id: number): Promise<response<VehicleType>>;
}
