import { GoogleDriveService } from '../google-drive/google-drive.service';
export declare class FilesHelperService {
    private readonly googleDriveService;
    private readonly basePath;
    private readonly logger;
    private readonly positions;
    constructor(googleDriveService: GoogleDriveService);
    saveTransactionFiles: (files: {
        [key: string]: Express.Multer.File[];
    }, transactionId: number) => Promise<any>;
}
