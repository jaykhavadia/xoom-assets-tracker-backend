// google-drive.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import { GoogleAuthService } from '../google-auth/google-auth.service';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;
  private readonly logger = new Logger(GoogleDriveService.name);

  constructor(private readonly googleAuthService: GoogleAuthService) {
    // Initialize the Google Drive client using the authenticated OAuth2 client
    const oAuth2Client = this.googleAuthService.getOAuth2Client();
    this.drive = google.drive({ version: 'v3', auth: oAuth2Client });

    // Set the OAuth2 client credentials
    const tokens = {
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    };
    oAuth2Client.setCredentials(tokens);
  }

  /**
   * Ensure that the OAuth2 client has valid credentials.
   */
  private async ensureAuthenticated() {
    const oAuth2Client = this.googleAuthService.getOAuth2Client();
    const tokenInfo = await oAuth2Client.getAccessToken();
    
    if (!tokenInfo.token) {
      this.logger.warn('Access token is missing or expired. Attempting to refresh.');
      await oAuth2Client.getAccessToken();
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

      const fileMetadata = {
        name: filePath.split('/').pop(),
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
      return response.data;
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
