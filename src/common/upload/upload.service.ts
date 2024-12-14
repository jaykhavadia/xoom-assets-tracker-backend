import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Model } from 'src/modules/model/entities/model.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
import { Action, Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { VehicleType } from 'src/modules/vehicle-type/entities/vehicle-type.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class UploadService {

    constructor(
        @InjectRepository(VehicleType)
        private readonly vehicleTypeRepository: Repository<VehicleType>,
        @InjectRepository(Model)
        private readonly modelRepository: Repository<Model>,
        @InjectRepository(OwnedBy)
        private readonly ownedByRepository: Repository<OwnedBy>,
        @InjectRepository(Aggregator)
        private readonly aggregatorRepository: Repository<Aggregator>,
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async readExcel(file: Express.Multer.File, type: string): Promise<{ vehicles: Vehicle[], errorArray: string[] } | { employees: Employee[], errorArray: string[] } | { transactions: Transaction[]; errorArray: string[] }> {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet name
            const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON

            const vehicle = await this.vehicleRepository.find();
            const location = await this.locationRepository.find();
            const employee = await this.employeeRepository.find();
            const vehicleTypes = await this.vehicleTypeRepository.find();
            const models = await this.modelRepository.find();
            const ownedBy = await this.ownedByRepository.find();
            const aggregator = await this.aggregatorRepository.find();

            // Check if jsonData has at least one item to determine the sheet type
            if (jsonData.length > 0) {
                if (Object.keys(jsonData[0]).includes('Code')) {
                    if (type !== 'vehicle') {
                        throw new Error('INVALID_FILE');
                    }
                    return await this.processVehicle(jsonData, models, vehicleTypes, ownedBy, aggregator);

                } else if (Object.keys(jsonData[0]).includes('E code')) {
                    if (type !== 'employee') {
                        throw new Error('INVALID_FILE')
                    }

                    return await this.processEmployee(jsonData, employee);
                } else if (Object.keys(jsonData[0]).includes('Vehicle No.')) {
                    if (type !== 'transaction') {
                        throw new Error('INVALID_FILE')
                    }

                    return await this.processTransaction(jsonData, vehicle, employee, location);
                } else {
                    console.warn(`Unrecognized sheet format in sheet: ${sheetName}`);
                }
            } else {
                console.warn('No data found in the uploaded Excel sheet.');
            }
        } catch (error) {
            console.log("[UploadService] [readExcel] error:", error)
            throw error;
        }

    }

    excelDateToJSDate = (serial: number) => {
        const excelStartDate = new Date(1900, 0, 1); // Excel starts from 1900-01-01
        const jsDate = new Date(excelStartDate.getTime() + (serial - 2) * 24 * 60 * 60 * 1000); // Adjust for leap year bug in Excel
        return jsDate;
    };

    excelDateToJSDateTransaction = (serial: number | string): string => {
        // Ensure `serial` is not null or undefined
        if (!serial) {
            throw new Error("Invalid input: serial date is required");
        }

        // Handle the case where `serial` is a string like '02-Oct-24'
        if (typeof serial === 'string' && isNaN(Number(serial))) {
            const parts = serial.split('-');
            if (parts.length !== 3) {
                throw new Error("Invalid date string format");
            }

            const [day, monthStr, year] = parts;
            const month = new Date(`${monthStr} 1, 2000`).getMonth() + 1; // Convert month name to number
            const formattedYear = year.length === 2 ? `20${year}` : year; // Handle two-digit year
            return `${formattedYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        // Handle the case where `serial` is a number (Excel serial date)
        if (typeof serial === 'number' || !isNaN(Number(serial))) {
            const excelStartDate = new Date(1900, 0, 1); // Excel starts from 1900-01-01
            const jsDate = new Date(excelStartDate.getTime() + (Number(serial) - 2) * 24 * 60 * 60 * 1000); // Adjust for leap year bug in Excel
            return jsDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
        }

        // Throw an error for unexpected input types
        throw new Error("Invalid input: serial date must be a string or number");
    };


    excelTimeTo24HourFormat = (excelTime: number): string => {
        // Excel time is a fraction of a day
        const totalSeconds = Math.round(excelTime * 24 * 60 * 60); // Total seconds in the day
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format as HH:mm:ss
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    processTransaction = async (jsonData: any, vehicles: Vehicle[], employees: Employee[], locations: Location[]): Promise<{ transactions: Transaction[]; errorArray: string[] }> => {
        const errorArray = [];
        const transactionPromises = jsonData.map(async (item) => {
            // Initialize a new transaction entity
            const transaction = new Transaction();

            // Find the associated vehicle
            const vehicleMatch = vehicles.find((vehicle) => vehicle.vehicleNo === item['Vehicle No.'].toString());
            if (vehicleMatch) {
                transaction.vehicle = vehicleMatch;
            } else {
                errorArray.push(`Vehicle with number ${item['Vehicle No.']} not found.`);
                return;
            }

            // Find the associated employee
            const employeeMatch = employees.find((employee) => employee.code === item['XDS No.']);
            if (employeeMatch) {
                transaction.employee = employeeMatch;
            } else {
                errorArray.push(`Employee with XDS No. ${item['XDS No.']} not found.`);
                return;
            }

            // Find the associated location
            const locationMatch = locations.find((location) => location.name === item['Location']);
            if (locationMatch) {
                transaction.location = locationMatch;
            } else {
                errorArray.push(`Location with name ${item['Location']} not found.`);
                return;
            }

            // Parse the date and time
            transaction.date = this.excelDateToJSDate(item['Cut Off Date']);
            transaction.time = this.excelTimeTo24HourFormat(item['Cut Off Time']); // Format as HH:mm:ss

            // Set the action as "Check Out" or other enums as necessary
            transaction.action = item['Status'] === 'Check Out' ? Action.OUT : Action.IN;

            // Set additional fields if necessary
            transaction.pictures = []; // Default empty pictures, add logic if needed
            transaction.comments = ''; // Default empty comments, update if needed

            // Save the transaction (you need to use a repository or save logic here)
            return await this.transactionRepository.save(transaction);
        });

        return { transactions: await Promise.all(transactionPromises), errorArray };
    };

    processVehicle = async (jsonData: any, models: Model[], vehicleTypes: VehicleType[], ownedBy: OwnedBy[], aggregator: Aggregator[]): Promise<{ vehicles: Vehicle[], errorArray: string[] }> => {
        const errorArray = [];

        // If the first item has the key 'Vehicle No.', process as vehicles
        const vehiclePromises = jsonData.map(async (item) => {
            const vehicle = new Vehicle(); // Create an instance of the Vehicle class
            vehicle.code = item['Code'];
            vehicle.vehicleNo = item['Vehicle No.'];

            const modelsMatch = models.find((model) => model.brand === item['Model']);
            if (modelsMatch) {
                vehicle.model = modelsMatch;
            } else {
                // const newModel = this.modelRepository.create({ brand: item['Model'] });
                // await this.modelRepository.save(newModel);
                // vehicle.model = newModel;
                errorArray.push(`Model with brand ${item['Model']} not found.`);
                return;
            }

            const vehicleTypeMatch = vehicleTypes.find(
                (vehicleType) => {
                    return vehicleType.name === item['Category'] && vehicleType.fuel === item['Fuel'];
                }
            );
            if (vehicleTypeMatch) {
                vehicle.vehicleType = vehicleTypeMatch;
            } else {
                // const newVehicleType = this.vehicleTypeRepository.create({
                //     name: item['Category'],
                //     fuel: item['Fuel'],
                // });
                // await this.vehicleTypeRepository.save(newVehicleType);
                // vehicle.vehicleType = newVehicleType;
                errorArray.push(`vehicleType with Category ${item['Category']} & Fuel ${item['Fuel']} not found.`);
                return;
            }

            const ownedByMatch = ownedBy.find((owner) => owner.name === item['From']);
            if (ownedByMatch) {
                vehicle.ownedBy = ownedByMatch;
            } else {
                // const newOwnedBy = this.ownedByRepository.create({ name: item['From'] });
                // await this.ownedByRepository.save(newOwnedBy);
                // vehicle.ownedBy = newOwnedBy;
                errorArray.push(`From(ownedBy) with name ${item['From']} not found.`);
                return;
            }

            vehicle.chasisNumber = item['Chasis No.'];
            vehicle.aggregator = aggregator.find((item) => item.name === 'idel');
            vehicle.registrationExpiry = this.excelDateToJSDate(item['Expiry Date']);
            vehicle.emirates = item['Emirates'];
            vehicle.status = item['Status'] || 'available';
            vehicle.isDeleted = item['isDeleted'] || false; // Default to false if not present
            return vehicle;
        });

        const resolvedVehicles = await Promise.all(vehiclePromises);

        return { vehicles: resolvedVehicles, errorArray };
    }

    processEmployee = async (jsonData: any, employeeList: Employee[]): Promise<{ employees: Employee[], errorArray: string[] }> => {
        const errorArray = [];
        const employees: Employee[] = [];
        // If the first item has the key 'E code', process as employees
        employees.push(...jsonData.map((item: any) => {
            // Find the associated employee
            const employeeMatch = employeeList.find((employee) => employee.code === item['E code']);
            if (employeeMatch) {
                errorArray.push(`Employee with E code ${item['E code']} Already exist.`);
                return;
            }
            try {
                const employee = new Employee(); // Create an instance of the Employee class
                employee.name = item['Name'];
                employee.code = item['E code'];
                employee.status = item['Status'] || 'Active';
                return employee;
            } catch (error) {
                console.log("[UploadService] [employees.push] error:", error)
                errorArray.push(`Employee with E Code ${item['E code']} Failed to Add.`);
                return;
            }
        }));
        return { employees, errorArray };
    }

}
