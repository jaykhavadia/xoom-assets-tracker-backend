import { Emirates } from '../entities/vehical.entity';
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
    status: 'available' | 'occupied';
    isDeleted: boolean;
}
