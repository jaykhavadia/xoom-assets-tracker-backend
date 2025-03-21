import { Employee } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { EmployeeWithVehicleDTO } from "./dto/employee.dto";
export declare class EmployeeService {
    private employeeRepository;
    private readonly logger;
    constructor(employeeRepository: Repository<Employee>);
    create(employee: Employee): Promise<Employee>;
    findAll(): Promise<EmployeeWithVehicleDTO[]>;
    findOne(id: number): Promise<Employee>;
    findByCode(code: string): Promise<Employee>;
    update(id: number, employee: Employee): Promise<Employee>;
    remove(id: number): Promise<void>;
    updateEmployees(employees: Employee[]): Promise<void>;
}
