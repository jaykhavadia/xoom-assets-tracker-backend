import { ConfigService } from '@nestjs/config';
import { AuthTokenService } from '../auth-token/auth-token.service';
export declare class GoogleAuthService {
    private configService;
    private authTokenService;
    private oAuth2Client;
    private readonly logger;
    constructor(configService: ConfigService, authTokenService: AuthTokenService);
    generateAuthUrl(): string;
    getTokens(code: string): Promise<any>;
    setCredentials(accessToken: string, refreshToken: string): void;
    refreshAccessToken(): Promise<void>;
    getOAuth2Client(): any;
}
