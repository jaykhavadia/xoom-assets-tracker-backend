import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Model } from 'src/modules/model/entities/model.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
import { CreateTransactionDto } from 'src/modules/transaction/dto/CreateTransaction.dto';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { VehicleType } from 'src/modules/vehicle-type/entities/vehicle-type.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Repository } from 'typeorm';
export declare class UploadService {
    private readonly vehicleTypeRepository;
    private readonly modelRepository;
    private readonly ownedByRepository;
    private readonly aggregatorRepository;
    private readonly vehicleRepository;
    private readonly employeeRepository;
    private readonly locationRepository;
    private readonly transactionRepository;
    constructor(vehicleTypeRepository: Repository<VehicleType>, modelRepository: Repository<Model>, ownedByRepository: Repository<OwnedBy>, aggregatorRepository: Repository<Aggregator>, vehicleRepository: Repository<Vehicle>, employeeRepository: Repository<Employee>, locationRepository: Repository<Location>, transactionRepository: Repository<Transaction>);
    timeRegex: RegExp;
    validateTime: (input: string) => boolean;
    readExcel(file: Express.Multer.File, type: string): Promise<{
        vehicles: Vehicle[];
        errorArray: string[];
    } | {
        employees: Employee[];
        errorArray: string[];
    } | {
        transactions: CreateTransactionDto[];
        errorArray: string[];
    } | {
        fine: any[];
        errorArray: string[];
    }>;
    excelDateToJSDate: (serial: number) => Date;
    excelDateToJSDateTransaction: (serial: number | string) => string;
    excelTimeTo24HourFormat: (excelTime: number) => string;
    processFine: (jsonData: any, vehicles: Vehicle[], employees: Employee[], transaction: Transaction[]) => Promise<{
        fine: any[];
        errorArray: string[];
    }>;
    processTransaction: (jsonData: any, vehicles: Vehicle[], employees: Employee[], locations: Location[], aggregators: Aggregator[]) => Promise<{
        transactions: CreateTransactionDto[];
        errorArray: string[];
    }>;
    processVehicle: (jsonData: any, models: Model[], vehicleTypes: VehicleType[], ownedBy: OwnedBy[], aggregator: Aggregator[], vehicleDataSet: Vehicle[]) => Promise<{
        vehicles: Vehicle[];
        errorArray: string[];
    }>;
    processEmployee: (jsonData: any, employeeList: Employee[]) => Promise<{
        employees: Employee[];
        errorArray: string[];
    }>;
    convertTo24HourFormat: (time: string) => string;
}
