import { Employee } from "src/modules/employee/entities/employee.entity";
import { Location } from "src/modules/location/entities/location.entity";
import { Vehicle } from "src/modules/vehicle/entities/vehical.entity";
import { User } from "src/modules/user/entities/user.entity";
export declare enum PicturePosition {
    BACK = "back",
    FRONT = "front",
    LEFT = "left",
    RIGHT = "right"
}
export declare enum Action {
    IN = "in",
    OUT = "out"
}
export declare class Transaction {
    id: number;
    date: Date;
    time: string;
    action: Action;
    pictures: Array<{
        url: string;
        position?: PicturePosition;
    }>;
    comments: string;
    vehicle: Vehicle;
    employee: Employee;
    location: Location;
    user: User;
    aggregator: string;
    createdAt: Date;
    updatedAt: Date;
}
