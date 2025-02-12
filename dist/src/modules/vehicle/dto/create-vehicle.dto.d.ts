import { Emirates } from "../entities/vehical.entity";
export declare class VehicleDto {
    vehicleNo: string;
    code: string;
    vehicleTypeId: number;
    modelId: number;
    ownedById: number;
    aggregatorId: number;
    registrationExpiry: Date;
    emirates: Emirates;
    chasisNumber: string;
    location: string;
    status: "available" | "occupied";
    isActive: boolean;
    isDeleted: boolean;
}
