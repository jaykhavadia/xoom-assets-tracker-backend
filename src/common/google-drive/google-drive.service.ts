import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleDriveService implements OnModuleInit {
  private readonly logger = new Logger(GoogleDriveService.name);
  private drive: drive_v3.Drive;
  private oAuth2Client: any; // To hold the OAuth2 client

  constructor(private readonly configService: ConfigService) { }

  async onModuleInit(): Promise<void> {
    this.oAuth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );

    this.oAuth2Client.setCredentials({
      access_token: this.configService.get('GOOGLE_ACCESS_TOKEN'),
      refresh_token: this.configService.get('GOOGLE_REFRESH_TOKEN'),
    });

    this.drive = google.drive({ version: 'v3', auth: this.oAuth2Client });
  }

  /**
   * Ensure that the OAuth2 client has valid credentials.
   */
  private async ensureAuthenticated() {
    const tokenInfo = await this.oAuth2Client.getAccessToken();

    if (!tokenInfo.token) {
      this.logger.warn('Access token is missing or expired. Attempting to refresh.');
      await this.oAuth2Client.getAccessToken();
    }
  }

  /**
   * Uploads a file to Google Drive.
   * @param filePath The local path of the file to be uploaded.
   * @param folderId The ID of the folder where the file should be uploaded.
   * @returns The uploaded file metadata including its ID.
   */
  async uploadFile(filePath: string, folderId: string) {
    try {
      await this.ensureAuthenticated(); // Ensure authentication

      // Ensure file exists before attempting to upload
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const fileMetadata = {
        name: path.basename(filePath), // Use path.basename to extract the file name
        parents: [folderId],
      };
      const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(filePath),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name',
      });

      this.logger.log(`File uploaded successfully: ${response.data.name}`);
      const fileId = response.data.id;
      console.log(`File uploaded successfully: ${fileId}`);

      // Set the file permissions to "Anyone with the link" can view
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Return the file's public URL
      const publicUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      return { id: fileId, url: publicUrl };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a folder on Google Drive.
   * @param folderName The name of the folder to create.
   * @param parentFolderId The ID of the parent folder (optional).
   * @returns The ID of the created folder.
   */
  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      await this.ensureAuthenticated(); // Ensure authentication

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : [],
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      this.logger.log(`Folder created successfully: ${folderName}`);
      return response.data.id;
    } catch (error) {
      this.logger.error(`Error creating folder: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets or creates a folder on Google Drive.
   * @param folderName The name of the folder to get or create.
   * @param parentFolderId The ID of the parent folder (optional).
   * @returns The ID of the existing or newly created folder.
   */
  async getOrCreateFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      await this.ensureAuthenticated(); // Ensure authentication

      const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId}' in parents`;
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name)',
      });
      if (response.data.files && response.data.files.length > 0) {
        this.logger.log(`Folder already exists: ${folderName}`);
        return response.data.files[0].id;
      }

      this.logger.log(`Folder not found. Creating new folder: ${folderName}`);
      return this.createFolder(folderName, parentFolderId);
    } catch (error) {
      this.logger.error(`Error getting or creating folder: ${error.message}`);
      throw error;
    }
  }
}
