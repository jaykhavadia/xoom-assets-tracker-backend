import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class FilesHelperService {
    private readonly basePath = 'public/images'; // Base path for storing images
    private readonly logger = new Logger(FilesHelperService.name);
    private readonly positions = ['back', 'front', 'left', 'right'];

    constructor(private readonly googleDriveService: GoogleDriveService) { }

    /**
     * Saves transaction files to a specific folder based on the transaction ID.
     * @param files - The uploaded files.
     * @param transactionId - The ID of the transaction.
     * @returns An object mapping positions to their file URLs.
     */
    saveTransactionFiles = async (files: { [key: string]: Express.Multer.File[] }, transactionId: number): Promise<any> => {
        try {
            const folderPath = path.join(process.cwd(), 'public', 'images', transactionId.toString());
            this.logger.log(`Folder path: ${folderPath}`);

            // Ensure the folder for this transaction exists
            await fs.mkdir(folderPath, { recursive: true });

            const parentFolderId = '1BftHKWaW-2ZU-p0PrFP2YFapmWKlnnKP'; // Replace with your folder ID

            // Create the folder named {transaction} inside the specified parent folder
            const sheetFolderId = await this.googleDriveService.getOrCreateFolder(transactionId.toString(), parentFolderId);
            // Save files based on their positions
            const savedFiles = await Promise.all(this.positions.map(async (position) => {
                const file = files[`vehiclePictures[${position}]`] && files[`vehiclePictures[${position}]`][0];
                if (file) {
                    const fileName = `${position}.png`; // Use position as the filename
                    const filePath = path.join(folderPath, fileName);
                    this.logger.log(`File path: ${filePath}`);

                    try {
                        await fs.writeFile(filePath, file.buffer);
                        this.logger.log(`File saved successfully at: ${filePath}`);

                        // Upload file to Google Drive
                        // Uncomment the line below when you're ready to upload
                        const savedFile = await this.googleDriveService.uploadFile(filePath, sheetFolderId);
                        return { [position]: { url: savedFile.url } };
                    } catch (fileError) {
                        this.logger.warn(`[FilesHelper] Error writing file for position ${position}: ${fileError.message}`);
                        return { [position]: { url: null } };
                    }
                } else {
                    this.logger.warn(`No file provided for position ${position}`);
                    return { [position]: { url: null } };
                }
            }));

            // Clean up the temporary directory after processing files
            try {
                await fs.rm(folderPath, { recursive: true, force: true });
                this.logger.log('Temporary directory deleted successfully');
            } catch (error) {
                this.logger.error('Error deleting directory:', error);
            }
            return savedFiles; // Return an array of results from saving files
        } catch (error) {
            this.logger.error(`[FilesHelper] [saveTransactionFiles] Error: ${error.message}`);
            throw new Error('Failed to save transaction files');
        }
    }
}