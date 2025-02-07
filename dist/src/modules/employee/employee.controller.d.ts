import { EmployeeService } from "./employee.service";
import { Employee } from "./entities/employee.entity";
import { UploadService } from "src/common/upload/upload.service";
import { SheetService } from "../sheet/sheet.service";
import { GoogleDriveService } from "src/common/google-drive/google-drive.service";
export declare class EmployeeController {
    private readonly employeeService;
    private readonly uploadService;
    private readonly sheetService;
    private readonly googleDriveService;
    private readonly logger;
    constructor(employeeService: EmployeeService, uploadService: UploadService, sheetService: SheetService, googleDriveService: GoogleDriveService);
    create(employee: Employee): Promise<response<Employee>>;
    findAll(): Promise<response<Partial<Employee>[]>>;
    findOne(id: string): Promise<response<Employee>>;
    update(id: string, employee: Employee): Promise<response<Employee>>;
    remove(id: string): Promise<response<void>>;
    uploadExcel(file: Express.Multer.File): Promise<response<void>>;
}
