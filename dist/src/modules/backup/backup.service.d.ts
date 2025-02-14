export declare class BackupService {
    private readonly logger;
    backupDatabase(): Promise<void>;
    private sendEmail;
    private cleanupOldBackups;
}
