import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {

    private readonly logger = new Logger(EmployeeService.name); // Logger with class name

    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) {}

    /**
     * Creates a new employee entry in the database
     * @param employee - the employee object to be created
     * @returns the created employee
     */
    async create(employee: Employee): Promise<Employee> {
        try {
            return await this.employeeRepository.save(employee);
        } catch (error) {
            this.logger.error(`[EmployeeService] [create] Error: ${error.message}`);
            throw new InternalServerErrorException('Failed to create employee.');
        }
    }

    /**
     * Retrieves all employees from the database
     * @returns an array of employees
     */
    async findAll(): Promise<Employee[]> {
        try {
            return await this.employeeRepository.find();
        } catch (error) {
            this.logger.error(`[EmployeeService] [findAll] Error: ${error.message}`);
            throw new InternalServerErrorException('Failed to retrieve employees.');
        }
    }

    /**
     * Retrieves an employee by their ID
     * @param id - the ID of the employee to retrieve
     * @returns the found employee
     */
    async findOne(id: number): Promise<Employee> {
        try {
            return await this.employeeRepository.findOneBy({ id });
        } catch (error) {
            this.logger.error(`[EmployeeService] [findOne] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to find employee with id: ${id}`);
        }
    }

    async findByCode(code: string): Promise<Employee> {
        try {
            return await this.employeeRepository.findOneBy({ code });
        } catch (error) {
            this.logger.error(`[EmployeeService] [findOne] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to find employee with code: ${code}`);
        }
    }

    /**
     * Updates an existing employee in the database
     * @param id - the ID of the employee to update
     * @param employee - the employee object with updated information
     * @returns the updated employee
     */
    async update(id: number, employee: Employee): Promise<Employee> {
        try {
            await this.employeeRepository.update(id, employee);
            return await this.findOne(id);
        } catch (error) {
            this.logger.error(`[EmployeeService] [update] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to update employee with id: ${id}`);
        }
    }

    /**
     * Removes an employee by their ID
     * @param id - the ID of the employee to remove
     */
    async remove(id: number): Promise<void> {
        try {
            let employee = await this.findOne(id);
            if (!employee) {
                throw new InternalServerErrorException(`No data with id: ${id}`);
            }
            await this.employeeRepository.delete(id);
        } catch (error) {
            this.logger.error(`[EmployeeService] [remove] Error: ${error.message}`);
            throw new InternalServerErrorException(`Failed to delete employee with id: ${id}`);
        }
    }

    /**
     * Clears the Employee table and inserts new employee data
     * @param employees - array of new employees to be inserted
     */
    async updateEmployees(employees: Employee[]): Promise<void> {
        try {
            this.logger.log('Starting updateEmployees function.');

            // // Disable foreign key checks before truncating the table
            // await this.employeeRepository.query('SET FOREIGN_KEY_CHECKS = 0');

            // // Clear the employee table
            // await this.employeeRepository.clear();

            // // Re-enable foreign key checks after clearing the table
            // await this.employeeRepository.query('SET FOREIGN_KEY_CHECKS = 1');

            // Insert the new employee data
            await this.employeeRepository.save(employees);

            this.logger.log('Successfully updated employees.');
        } catch (error) {
            this.logger.error(`[EmployeeService] [updateEmployees] Error: ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }
}
