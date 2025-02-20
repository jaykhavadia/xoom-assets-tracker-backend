import { Vehicle } from "src/modules/vehicle/entities/vehical.entity";
export declare class EmployeeWithVehicleDTO {
    id: number;
    code: string;
    name: string;
    status: "active" | "inactive";
    isDeleted: boolean;
    vehicle?: Partial<Vehicle>;
    aggregator?: string;
}
