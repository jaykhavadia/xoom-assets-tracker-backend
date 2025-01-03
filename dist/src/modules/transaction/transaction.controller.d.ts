import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { FilesHelperService } from 'src/common/files-helper/files-helper.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/CreateTransaction.dto';
import { UploadService } from 'src/common/upload/upload.service';
import { SheetService } from '../sheet/sheet.service';
export declare class TransactionController {
    private readonly transactionService;
    private readonly uploadService;
    private readonly sheetService;
    private readonly filesHelperService;
    private readonly logger;
    constructor(transactionService: TransactionService, uploadService: UploadService, sheetService: SheetService, filesHelperService: FilesHelperService);
    create(body: CreateTransactionDto, files?: {
        [key: string]: Express.Multer.File[];
    }): Promise<response<Transaction>>;
    update(id: string, body: UpdateTransactionDto): Promise<response<Transaction>>;
    findAll(): Promise<response<Transaction[]>>;
    findPastTransaction(vehicleNo: string): Promise<response<Transaction>>;
    remove(id: string): Promise<response<void>>;
    getTransactionsByDate(from?: string, to?: string, months?: number, date?: string): Promise<response<Transaction[]>>;
    findOne(id: string): Promise<response<Transaction>>;
    uploadExcel(file: Express.Multer.File): Promise<response<any>>;
    uploadFineExcel(file: Express.Multer.File): Promise<response<any>>;
}
