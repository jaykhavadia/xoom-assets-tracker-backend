import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
export declare class EmployeeService {
    private employeeRepository;
    private readonly logger;
    constructor(employeeRepository: Repository<Employee>);
    create(employee: Employee): Promise<Employee>;
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    update(id: number, employee: Employee): Promise<Employee>;
    remove(id: number): Promise<void>;
    updateEmployees(employees: Employee[]): Promise<void>;
}
