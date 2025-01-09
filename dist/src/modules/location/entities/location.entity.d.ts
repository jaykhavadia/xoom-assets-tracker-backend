import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
export declare class Location {
    id: number;
    name: string;
    fullAddress: string;
    transactions: Transaction[];
}
