import { Action } from "../entities/transaction.entity";
import { User } from "src/modules/user/entities/user.entity";
export declare class CreateTransactionDto {
    comments: string;
    date: Date;
    action: Action;
    employee: number;
    location: number;
    vehicle: string;
    user: Partial<User>;
    aggregator?: string;
    time: string;
    isCaptured: string;
}
export declare class UpdateTransactionDto {
    comments: string;
    date: string;
    action: Action;
    employee: number;
    location: number;
    vehicle: string;
    aggregator?: string;
    time: string;
    pictures: [];
    user: Partial<User>;
}
