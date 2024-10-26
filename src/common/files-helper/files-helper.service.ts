import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class FilesHelperService {
    private readonly basePath = 'public/images'; // Base path for storing images
    private readonly logger = new Logger(FilesHelperService.name);
    constructor(private readonly googleDriveService: GoogleDriveService) {
    }
    /**
     * Saves transaction files to a specific folder based on the transaction ID.
     * @param files - The uploaded files.
     * @param transactionId - The ID of the transaction.
     * @returns An object mapping positions to their file URLs.
     */
    saveTransactionFiles = async (files: { [key: string]: Express.Multer.File[] }, transactionId: number): Promise<any> => {
        try {
            // Use process.cwd() to get the root project directory
            const folderPath = path.join(process.cwd(), 'public', 'images', transactionId.toString());
            this.logger.log(`Folder path: ${folderPath}`);

            // Ensure the folder for this transaction exists
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }


            const positions = ['back', 'front', 'left', 'right'];
            // The ID of the parent folder where the new folder should be created
            const parentFolderId = '1BftHKWaW-2ZU-p0PrFP2YFapmWKlnnKP'; // Replace with your folder ID

            // Create the folder named {transaction} inside the specified parent folder
            const sheetFolderId = await this.googleDriveService.getOrCreateFolder(transactionId.toString(), parentFolderId);
            // Save files based on their positions
            const savedFiles = positions.map(async (position) => {
                const file = files[`vehiclePictures[${position}]`] && files[`vehiclePictures[${position}]`][0];
                if (file) {
                    const fileName = `${position}.png`; // Use position as the filename
                    const filePath = path.join(folderPath, fileName);
                    this.logger.log(`File path: ${filePath}`);

                    try {
                        fs.writeFileSync(filePath, file.buffer);

                        console.log("Checking if file exists at:", filePath);
                        if (!fs.existsSync(filePath)) {
                            console.error("File does not exist:", filePath);
                            throw new Error("File not found");
                        }

                        const savedFile = await this.googleDriveService.uploadFile(filePath, sheetFolderId);

                        // Clean up the temporary file after uploading
                        await fs.promises.unlink(filePath);
                        return { [position]: { url: savedFile.url } };
                    } catch (fileError) {
                        this.logger.error(`[FilesHelper] Error writing file for position ${position}: ${fileError.message}`);
                        return { [position]: { url: null } };
                        // Handle the error as needed
                    }
                } else {
                    this.logger.warn(`No file provided for position ${position}`);
                    return { [position]: { url: null } };
                    // No file provided for this position
                }
            });
            return Promise.all(savedFiles); // Return an object mapping positions to their file URLs
        } catch (error) {
            this.logger.error(`[FilesHelper] [saveTransactionFiles] Error: ${error.message}`); // Log error
            throw new Error('Failed to save transaction files'); // Throw error to indicate failure
        }
    }
}