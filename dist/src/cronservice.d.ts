import { AuthTokenService } from './common/auth-token/auth-token.service';
export declare class CronService {
    private readonly authTokenService;
    constructor(authTokenService: AuthTokenService);
    refreshAccessToken(): Promise<void>;
}
