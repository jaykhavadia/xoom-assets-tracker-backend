import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import * as moment from 'moment';
import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Model } from 'src/modules/model/entities/model.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
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
    ) { }

    async readExcel(file: Express.Multer.File, type: string): Promise<Vehicle[] | Employee[]> {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet name
            const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON
            const vehicles = [];

            const vehicleTypes = await this.vehicleTypeRepository.find();
            const models = await this.modelRepository.find();
            const ownedBy = await this.ownedByRepository.find();
            const aggregator = await this.aggregatorRepository.find();

            const employees: Employee[] = [];

            // Check if jsonData has at least one item to determine the sheet type
            if (jsonData.length > 0) {
                if (Object.keys(jsonData[0]).includes('Code')) {
                    if (type === 'employee') {
                        throw new Error('INVALID_FILE');
                    }

                    // If the first item has the key 'Vehicle No.', process as vehicles
                    const vehiclePromises = jsonData.map(async (item) => {
                        const vehicle = new Vehicle(); // Create an instance of the Vehicle class
                        vehicle.code = item['Code'];
                        vehicle.vehicleNo = item['Vehicle No.'];

                        const modelsMatch = models.find((model) => model.brand === item['Model']);
                        if (modelsMatch) {
                            vehicle.model = modelsMatch;
                        } else {
                            const newModel = this.modelRepository.create({ brand: item['Model'] });
                            await this.modelRepository.save(newModel);
                            vehicle.model = newModel;
                        }

                        const vehicleTypeMatch = vehicleTypes.find(
                            (vehicleType) => {
                                return vehicleType.name === item['Category'] && vehicleType.fuel === item['Fuel'];
                            }
                        );
                        if (vehicleTypeMatch) {
                            vehicle.vehicleType = vehicleTypeMatch;
                        } else {
                            const newVehicleType = this.vehicleTypeRepository.create({
                                name: item['Category'],
                                fuel: item['Fuel'],
                            });
                            await this.vehicleTypeRepository.save(newVehicleType);
                            vehicle.vehicleType = newVehicleType;
                        }

                        const ownedByMatch = ownedBy.find((owner) => owner.name === item['From']);
                        if (ownedByMatch) {
                            vehicle.ownedBy = ownedByMatch;
                        } else {
                            const newOwnedBy = this.ownedByRepository.create({ name: item['From'] });
                            await this.ownedByRepository.save(newOwnedBy);
                            vehicle.ownedBy = newOwnedBy;
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

                    return resolvedVehicles;
                } else if (Object.keys(jsonData[0]).includes('E code')) {
                    if (type === 'vehicle') {
                        throw new Error('INVALID_FILE')
                    }
                    // If the first item has the key 'E code', process as employees
                    employees.push(...jsonData.map(item => {
                        const employee = new Employee(); // Create an instance of the Employee class
                        employee.name = item['Name'];
                        employee.code = item['E code'];
                        employee.status = item['Status'] || 'Active';
                        employee.isDeleted = item['isDeleted'] || false; // Default to false if not present
                        return employee;
                    }));
                    return employees;
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

}
