import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
export declare class Employee {
    id: number;
    code: string;
    name: string;
    status: 'active' | 'inactive';
    isDeleted: boolean;
    transactions: Transaction[];
}
