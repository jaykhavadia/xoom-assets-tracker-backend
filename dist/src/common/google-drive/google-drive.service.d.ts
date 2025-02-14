import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from '../google-auth/google-auth.service';
import { AuthTokenService } from '../auth-token/auth-token.service';
export declare class GoogleDriveService implements OnModuleInit {
    private readonly configService;
    private readonly googleAuthService;
    private readonly authTokenService;
    private readonly logger;
    private drive;
    private oAuth2Client;
    constructor(configService: ConfigService, googleAuthService: GoogleAuthService, authTokenService: AuthTokenService);
    onModuleInit(): Promise<void>;
    setDriveCredentials(): Promise<void>;
    ensureAuthenticated(): Promise<void>;
    private resetAccessToken;
    uploadFile(filePath: string, folderId: string): Promise<{
        id: string;
        url: string;
    }>;
    createFolder(folderName: string, parentFolderId?: string): Promise<string>;
    getOrCreateFolder(folderName: string, parentFolderId?: string): Promise<string>;
}
