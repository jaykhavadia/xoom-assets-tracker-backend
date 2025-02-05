import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { VehicleType } from 'src/modules/vehicle-type/entities/vehicle-type.entity';
import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
import { Model } from 'src/modules/model/entities/model.entity';
export declare enum Emirates {
    AbuDhabi = "AbuDhabi",
    Dubai = "Dubai",
    Sharjah = "Sharjah",
    Ajman = "Ajman",
    Fujairah = "Fujairah",
    RasAlKhaimah = "RasAlKhaimah",
    UmmAlQuwain = "UmmAlQuwain"
}
export declare class Vehicle {
    id: string;
    vehicleNo: string;
    code: string;
    vehicleType: VehicleType;
    model: Model;
    ownedBy: OwnedBy;
    aggregator: Aggregator;
    registrationExpiry: Date;
    emirates: Emirates;
    chasisNumber: string;
    location: string;
    status: 'available' | 'occupied';
    isDeleted: boolean;
    transactions: Transaction[];
}
