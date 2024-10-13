import { BadRequestException, Injectable } from '@nestjs/common';
import { error } from 'console';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class UploadService {

    async readExcel(file: Express.Multer.File, type: string): Promise<Vehicle[] | Employee[]> {
        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet name
            const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON
            const vehicles: Vehicle[] = [];
            const employees: Employee[] = [];
            
            // Check if jsonData has at least one item to determine the sheet type
            if (jsonData.length > 0) {
                if (Object.keys(jsonData[0]).includes('Vehicle No.')) {
                    if(type==='employee'){
                        throw new Error('INVALID_FILE')
                    }
                    // If the first item has the key 'Vehicle No.', process as vehicles
                    vehicles.push(...jsonData.map(item => {
                        const vehicle = new Vehicle(); // Create an instance of the Vehicle class
                        vehicle.vehicleNo = item['Vehicle No.'];
                        vehicle.from = item['From'];
                        vehicle.model = item['Model'];
                        vehicle.status = item['Status'] || 'available';
                        vehicle.isDeleted = item['isDeleted'] || false; // Default to false if not present
                        return vehicle;
                    }));
                    return vehicles;
                } else if (Object.keys(jsonData[0]).includes('E code')) {
                    if(type==='vehicle'){
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

}
