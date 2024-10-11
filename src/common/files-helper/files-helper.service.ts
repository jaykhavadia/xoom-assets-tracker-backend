import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesHelperService {
    private static readonly basePath = 'public/images'; // Base path for storing images
    private static readonly logger = new Logger(FilesHelperService.name);

    /**
     * Saves transaction files to a specific folder based on the transaction ID.
     * @param files - The uploaded files.
     * @param transactionId - The ID of the transaction.
     * @returns An object mapping positions to their file URLs.
     */
    static saveTransactionFiles(files: { [key: string]: Express.Multer.File[] }, transactionId: number): any {
        try {
            // Use process.cwd() to get the root project directory
            const folderPath = path.join(process.cwd(), 'public', 'images', transactionId.toString());
            this.logger.log(`Folder path: ${folderPath}`);

            // Ensure the folder for this transaction exists
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const savedFiles: any = {};
            const positions = ['back', 'front', 'left', 'right'];

            // Save files based on their positions
            positions.forEach((position) => {
                const file = files[`vehiclePictures[${position}]`] && files[`vehiclePictures[${position}]`][0];
                if (file) {
                    const fileName = `${position}.png`; // Use position as the filename
                    const filePath = path.join(folderPath, fileName);
                    this.logger.log(`File path: ${filePath}`);

                    try {
                        fs.writeFileSync(filePath, file.buffer);
                        savedFiles[position] = { url: `/images/${transactionId}/${fileName}`, position };
                    } catch (fileError) {
                        this.logger.error(`[FilesHelper] Error writing file for position ${position}: ${fileError.message}`);
                        savedFiles[position] = null; // Handle the error as needed
                    }
                } else {
                    this.logger.warn(`No file provided for position ${position}`);
                    savedFiles[position] = null; // No file provided for this position
                }
            });

            return savedFiles; // Return an object mapping positions to their file URLs
        } catch (error) {
            this.logger.error(`[FilesHelper] [saveTransactionFiles] Error: ${error.message}`); // Log error
            throw new Error('Failed to save transaction files'); // Throw error to indicate failure
        }
    }
}