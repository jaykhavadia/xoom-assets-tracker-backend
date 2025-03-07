import { TransactionService } from "./transaction.service";
import { Action, Transaction } from "./entities/transaction.entity";
import { FilesHelperService } from "src/common/files-helper/files-helper.service";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto/CreateTransaction.dto";
import { UploadService } from "src/common/upload/upload.service";
import { SheetService } from "../sheet/sheet.service";
import { User } from "../user/entities/user.entity";
import { GoogleDriveService } from "src/common/google-drive/google-drive.service";
export declare class TransactionController {
    private readonly transactionService;
    private readonly uploadService;
    private readonly sheetService;
    private readonly filesHelperService;
    private readonly googleDriveService;
    private readonly logger;
    constructor(transactionService: TransactionService, uploadService: UploadService, sheetService: SheetService, filesHelperService: FilesHelperService, googleDriveService: GoogleDriveService);
    create(body: CreateTransactionDto, user: Partial<User>, files?: {
        [key: string]: Express.Multer.File[];
    }): Promise<response<Transaction>>;
    update(id: string, user: Partial<User>, body: UpdateTransactionDto): Promise<response<Transaction>>;
    findAll(): Promise<response<Transaction[]>>;
    findPastTransaction(vehicleNo: string, action: Action): Promise<response<Transaction>>;
    getEmployeeLatestTransaction(employeeId: string): Promise<response<Transaction>>;
    remove(id: string): Promise<response<void>>;
    getTransactionsByDate(from?: string, to?: string, months?: number, date?: string): Promise<response<Transaction[]>>;
    uploadExcel(file: Express.Multer.File): Promise<response<any>>;
    uploadFineExcel(file: Express.Multer.File): Promise<response<any>>;
    findOne(id: string): Promise<response<Transaction>>;
}
