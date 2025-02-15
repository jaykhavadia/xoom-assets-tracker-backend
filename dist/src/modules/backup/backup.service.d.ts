import { EmployeeService } from "../employee/employee.service";
export declare class BackupService {
    private readonly employeeService;
    private readonly logger;
    constructor(employeeService: EmployeeService);
    backupDatabase(): Promise<void>;
    private sendEmail;
    private cleanupOldBackups;
}
