import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
export declare enum Fuel {
    Electric = "Electric",
    ICE = "ICE",
    Hybrid = "Hybrid"
}
export declare class VehicleType {
    id: number;
    name: string;
    fuel: Fuel;
    vehicles: Vehicle[];
}
