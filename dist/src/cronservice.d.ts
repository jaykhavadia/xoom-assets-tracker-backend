import { AuthTokenService } from './common/auth-token/auth-token.service';
export declare class CronService {
    private readonly authTokenService;
    constructor(authTokenService: AuthTokenService);
    handleCron(): Promise<void>;
    refreshAccessToken(): Promise<void>;
}
