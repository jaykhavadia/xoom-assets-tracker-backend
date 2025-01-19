import { Action } from '../entities/transaction.entity';
export declare class CreateTransactionDto {
    comments: string;
    date: Date;
    action: Action;
    employee: number;
    location: number;
    vehicle: string;
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
}
