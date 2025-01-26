import { Aggregator } from "src/modules/aggregator/entities/aggregator.entity";
import { Transaction } from "./entities/transaction.entity";
import { Repository } from "typeorm";
import { VehicleService } from "../vehicle/vehicle.service";
import { EmployeeService } from "../employee/employee.service";
import { LocationService } from "../location/location.service";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/CreateTransaction.dto";
import { AggregatorService } from "../aggregator/aggregator.service";
import { Employee } from "../employee/entities/employee.entity";
import { Location } from "../location/entities/location.entity";
import { Vehicle } from "../vehicle/entities/vehical.entity";
import { UploadService } from "../../common/upload/upload.service";
export declare class TransactionService {
    private transactionRepository;
    private readonly vehicleService;
    private readonly employeeService;
    private readonly locationService;
    private readonly aggregatorService;
    private readonly uploadService;
    private readonly logger;
    constructor(transactionRepository: Repository<Transaction>, vehicleService: VehicleService, employeeService: EmployeeService, locationService: LocationService, aggregatorService: AggregatorService, uploadService: UploadService);
    create(transactionDto: CreateTransactionDto): Promise<Transaction>;
    update(id: number, updateDto: UpdateTransactionDto): Promise<Transaction>;
    updateTransaction(id: number, updateDto: any): Promise<Transaction>;
    findOne(id: number): Promise<Transaction>;
    findAll(): Promise<Transaction[]>;
    remove(id: number): Promise<void>;
    findPastTransaction(vehicleNo: number): Promise<Transaction>;
    getCurrentDateTime: () => {
        date: string;
        time: string;
    };
    getTransactionsByDateRange(from?: string, to?: string, months?: number, date?: string): Promise<Transaction[]>;
    createBulkTransactions(transaction: Transaction[]): Promise<void>;
    updateTransactionRelation(transactionDto: CreateTransactionDto): Promise<{
        employee: Employee;
        location: Location;
        vehicle: Vehicle;
        aggregator: Aggregator;
    }>;
    convertTo24HourFormat: (time: string) => string;
    processTransaction(file: Express.Multer.File, type: string): Promise<any>;
}
