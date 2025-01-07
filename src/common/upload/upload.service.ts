import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Messages } from 'src/constants/messages.constants';
import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Model } from 'src/modules/model/entities/model.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
import { CreateTransactionDto } from 'src/modules/transaction/dto/CreateTransaction.dto';
import { Action, Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { VehicleType } from 'src/modules/vehicle-type/entities/vehicle-type.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Brackets, Repository } from 'typeorm';
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
    timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;

    validateTime = (input: string): boolean => {
        if (this.timeRegex.test(input)) {
            return true;
        } else {
            return false;
        }
    }

    async readExcel(file: Express.Multer.File, type: string): Promise<{ vehicles: Vehicle[], errorArray: string[] } | { employees: Employee[], errorArray: string[] } | { transactions: CreateTransactionDto[]; errorArray: string[] } | { fine: any[]; errorArray: string[] }> {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet name
            const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON

            const vehicle = await this.vehicleRepository.find();
            const transaction = await this.transactionRepository.find();
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
                } if (Object.keys(jsonData[0]).includes('Trip Date')) {
                    if (type !== 'fine') {
                        throw new Error('INVALID_FILE')
                    }
                    return await this.processFine(jsonData, vehicle, employee, transaction);
                } else {
                    console.warn(`Unrecognized sheet format in sheet: ${sheetName}`);
                    throw new Error('Unrecognized sheet format')
                }
            } else {
                console.warn('No data found in the uploaded Excel sheet.');
                throw new Error('No data found')
            }
        } catch (error) {
            console.log("[UploadService] [readExcel] error:", error)
            throw error;
        }

    }


    excelDateToJSDate = (serial: number): Date => {
        try {
            // Excel's date system starts from 1900-01-01, but it's incorrectly considering 1900 as a leap year
            const startDate = moment('1900-01-01'); // This is 1900-01-01 in UTC
            const correctedDate = startDate.add(serial - 2, 'days'); // Adjust by -2 for the Excel offset and leap year bug

            // Adjust the date to UTC and then apply your desired time offset
            const adjustedDate = correctedDate.utcOffset(0, true); // Ensure we stay in UTC timezone

            return adjustedDate.toDate(); // Return the JavaScript Date object
        } catch (error) {
            console.error("UploadService ~ excelDateToJSDate ~ error:", error)
            throw new Error("inCorrect Date Format");
        }
    };

    excelDateToJSDateTransaction = (serial: number | string): string => {
        try {

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
        } catch (error) {
            console.error("UploadService ~ excelDateToJSDateTransaction ~ error:", error)
            throw new Error("inCorrect Date Format");
        }
    };


    excelTimeTo24HourFormat = (excelTime: number): string => {
        try {
            // Excel time is a fraction of a day
            const totalSeconds = Math.round(excelTime * 24 * 60 * 60); // Total seconds in the day
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            // Format as HH:mm:ss
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } catch (error) {
            throw new Error("inCorrect Time Format");
        }

    }

    processFine = async (jsonData: any, vehicles: Vehicle[], employees: Employee[], transaction: Transaction[]): Promise<{ fine: any[]; errorArray: string[] }> => {
        const errorArray = [];

        const fineResponse = await jsonData.map(async (item, index) => {
            const { 'Trip Date': tripDate, 'Trip Time': tripTime, Plate, 'Amount(AED)': amount } = item;

            // Parse the date and time
            if (this.validateTime(tripTime)) {
                console.log("The string contains AM or PM");
            } else {
                errorArray.push(`inCorrect Time Format at Data No. ${index + 1} Expected HH:MM:SS AM/PM Got ${tripTime}`);
                return;
            }
            const date = new Date(this.excelDateToJSDate(tripDate));

            const time = this.convertTo24HourFormat(tripTime);

            // Find the associated vehicle
            const vehicleMatch = vehicles.find((vehicle) => vehicle.vehicleNo === Plate.toString());
            if (!vehicleMatch) {
                errorArray.push(`Vehicle with number ${Plate} not found.`);
                return null;  // Return null if vehicle not found
            }

            const vehicleNo = vehicleMatch.vehicleNo;
            const inputDate = new Date(date);

            // Validate that the date is valid and greater than the year 2020
            if (isNaN(inputDate.getTime()) || inputDate.getFullYear() <= 2020) {
                errorArray.push(`Invalid date ${inputDate} format provided. at ${index + 1}`);
                return;
            }

            const targetISODate = new Date(date).toISOString().split('T')[0];  // "2024-11-30"
            const targetDate = `${targetISODate} ${time}`;
            console.log("targetDate:", targetDate)

            const result = await this.transactionRepository
                .createQueryBuilder('t')
                .innerJoinAndSelect('t.vehicle', 'v', 'v.vehicleNo = :vehicleNo', { vehicleNo })
                .leftJoinAndSelect('t.employee', 'employee')
                .leftJoinAndSelect('t.location', 'location')
                .addSelect('location.name', 'locationName')
                .where(
                    new Brackets((qb) => {
                        qb.where('t.date < :endDate', { endDate: targetISODate })
                            .orWhere(
                                new Brackets((subQb) => {
                                    subQb.where('t.date = :endDate', { endDate: targetISODate })
                                        .andWhere('t.time <= :endTime', { endTime: time });
                                })
                            );
                    })
                )
                .orderBy('t.date', 'DESC')
                .limit(1)
                .getOne();

            let details;
            // console.log(result);
            if (!result) { errorArray.push(`Some thing is wrong No data found At ${index + 1} `); return; }
            if (result?.action === 'out') {
                details = {
                    employee_id: result.employee.id,
                    employee_name: result.employee.name,
                    employee_code: result.employee.code,
                    transaction_vehicleId: result.vehicle.id,
                    transaction_locationId: result.location.id,
                };
            } else {
                details = {
                    emirates: result.vehicle.emirates,
                    locationName: result.location.name
                };
            }
            return { tripDate: targetISODate, tripTime, Plate, amount, details };
        });

        const results = await Promise.all(fineResponse);

        return { fine: results.flat().filter(item => item !== null && item !== undefined), errorArray };  // Flatten and filter out null/undefined
    };


    processTransaction = async (jsonData: any, vehicles: Vehicle[], employees: Employee[], locations: Location[], aggregators: Aggregator[]): Promise<{ transactions: CreateTransactionDto[]; errorArray: string[] }> => {
        const errorArray = [];
        const transactionPromises = jsonData.map(async (item, index) => {
            try {
                // Initialize a new transaction entity
                const transaction = new CreateTransactionDto();

                // Set the action as "Check Out" or other enums as necessary
                transaction.action = item['Status'] === 'Check Out' ? Action.OUT : Action.IN;

                // Parse the date and time
                if (this.validateTime(item['Cut Off Time']) && !item['Cut Off Time'].includes('\'') && (item['Cut Off Time'].includes('AM') || item['Cut Off Time'].includes('PM'))) {
                    console.log("The string contains AM or PM");
                } else {
                    errorArray.push(`inCorrect Time Format at Data No. ${index + 1} Expected HH:MM:SS AM/PM Got ${item['Cut Off Time']}`);
                    return;
                }

                transaction.time = item['Cut Off Time']; // Format as HH:mm:ss
                transaction.date = this.excelDateToJSDate(item['Cut Off Date']);

                // Find the associated vehicle
                const vehicleMatch = vehicles.find((vehicle) => vehicle.vehicleNo === item['Vehicle No.'].toString());
                if (vehicleMatch) {
                    if (transaction.action === 'out') {
                        if (vehicleMatch.status === 'occupied') {
                            errorArray.push(`${Messages.vehicle.occupied(item['Vehicle No.'])} at Data No. ${index + 1}`); // Handle error
                            return
                        }

                        transaction.vehicle = vehicleMatch.id;
                    } else if (transaction.action === 'in') {
                        if (vehicleMatch.status === 'available') {
                            errorArray.push(`${Messages.vehicle.available(item['Vehicle No.'])} at Data No. ${index + 1}`); // Handle error
                            return;
                        }

                        transaction.vehicle = vehicleMatch.id;
                    }
                } else {
                    errorArray.push(`Vehicle with number ${item['Vehicle No.']} not found. at Data No. ${index + 1}`);
                    return;
                }

                // Find the associated aggregator
                const aggregatorMatch = aggregators.find((aggregator) => aggregator.name === item['Aggregator']);
                if (aggregatorMatch) {
                    transaction.aggregator = aggregatorMatch.name;
                } else {
                    errorArray.push(`Aggregator ${item['Aggregator']} not found. at Data No. ${index + 1}`);
                    return;
                }

                // Find the associated employees
                const employeeMatch = employees.find((employee) => employee.code === item['XDS No.']);
                if (employeeMatch) {
                    if (employeeMatch.status === 'inactive') {
                        errorArray.push(`${Messages.employee.inactive(item['XDS No.'])} at Data No. ${index + 1}`); // Handle error
                        return;
                    }
                    transaction.employee = employeeMatch.id;
                } else {
                    errorArray.push(`Employee with XDS No. ${item['XDS No.']} not found. at Data No. ${index + 1}`);
                    return;
                }

                // Find the associated location
                const locationMatch = locations.find((location) => location.name === item['Location']);
                if (locationMatch) {
                    transaction.location = locationMatch.id;
                } else {
                    errorArray.push(`Location with name ${item['Location']} not found. at Data No. ${index + 1}`);
                    return;
                }

                // Set additional fields if necessary
                // transaction.pictures = []; // Default empty pictures, add logic if needed
                transaction.comments = ''; // Default empty comments, update if needed

                // Save the transaction (you need to use a repository or save logic here)
                // return await this.transactionService.create(transaction);
            } catch (error) {
                errorArray.push(error.message);
            }
        });

        return { transactions: await Promise.all(transactionPromises), errorArray };
    };

    processVehicle = async (jsonData: any, models: Model[], vehicleTypes: VehicleType[], ownedBy: OwnedBy[], aggregator: Aggregator[]): Promise<{ vehicles: Vehicle[], errorArray: string[] }> => {
        const errorArray = [];
        const processedVehicles: { vehicleNo: string, code: string }[] = [];

        // If the first item has the key 'Vehicle No.', process as vehicles
        const vehiclePromises = jsonData.map(async (item) => {
            try {
                if (processedVehicles.length) {
                    // Check for duplicates
                    processedVehicles.forEach((processedVehicle) => {
                        if (
                            processedVehicle.vehicleNo === item['Vehicle No.'] ||
                            processedVehicle.code === item['Code']
                        ) {
                            errorArray.push(
                                `Vehicle with No: ${item['Vehicle No.']} OR Code: ${item['Code']} are Duplicate`
                            );
                        }
                    });
                }
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
                processedVehicles.push({ vehicleNo: vehicle.vehicleNo, code: vehicle.code })
                return vehicle;
            } catch (error) {
                errorArray.push(error.message);
            }
        });

        const resolvedVehicles = await Promise.all(vehiclePromises);

        return { vehicles: resolvedVehicles, errorArray };
    }

    processEmployee = async (jsonData: any, employeeList: Employee[]): Promise<{ employees: Employee[], errorArray: string[] }> => {
        const errorArray = [];
        const employees: Employee[] = [];
        const processedEmployee: string[] = [];
        // If the first item has the key 'E code', process as employees
        employees.push(...jsonData.map((item: any) => {
            try {
                // Find the associated employee
                const employeeMatch = employeeList.find((employee) => employee.code === item['E code']);
                if (employeeMatch) {
                    errorArray.push(`Employee with E code ${item['E code']} Already exist.`);
                    return;
                }
                if (processedEmployee.includes(item['E code'])) {
                    errorArray.push(
                        `Employee with E Code: ${item['E code']} are Duplicate`
                    );
                    return;
                }
                try {
                    const employee = new Employee(); // Create an instance of the Employee class
                    employee.name = item['Name'];
                    employee.code = item['E code'];
                    employee.status = item['Status'] || 'Active';
                    processedEmployee.push(item['E code']);
                    return employee;
                } catch (error) {
                    console.log("[UploadService] [employees.push] error:", error)
                    errorArray.push(`Employee with E Code ${item['E code']} Failed to Add.`);
                    return;
                }
            } catch (error) {
                errorArray.push(error.message);
            }
        }));
        return { employees, errorArray };
    }

    convertTo24HourFormat = (time: string): string => {
        try {
            // Check if the time format is hh:mm:ss AM/PM or hh:mm AM/PM
            const timeArray = time.split(/[:\s]/);

            // Parse hour and minute
            let hours: number = parseInt(timeArray[0], 10);
            let minutes: string = timeArray[1], seconds: string, period: string;
            if (timeArray.length === 3) {
                seconds = "00";
                period = timeArray[2]
            } else {
                seconds = timeArray[2];
                period = timeArray[3];
            }

            // Adjust hours based on AM/PM
            if (period.toLowerCase() === 'am' && hours === 12) {
                hours = 0; // Midnight case: 12 AM is 00:00
            } else if (period.toLowerCase() === 'pm' && hours !== 12) {
                hours += 12; // PM case: Add 12 for afternoon/evening
            }

            // Format hours, minutes, and seconds with leading zeros if necessary
            const formattedHour = hours.toString().padStart(2, '0');
            const formattedMinute = minutes.padStart(2, '0');
            const formattedSeconds = seconds.padStart(2, '0');

            return `${formattedHour}:${formattedMinute}:${formattedSeconds}`;
        } catch (error) {
            throw new Error('inCorrect Time format');
        }
    }

}
