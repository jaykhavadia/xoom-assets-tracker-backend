import { Repository } from 'typeorm';
import { AuthToken } from './auth-token.entity';
import { ConfigService } from '@nestjs/config';
export declare class AuthTokenService {
    private readonly authTokenRepository;
    private readonly configService;
    private readonly logger;
    constructor(authTokenRepository: Repository<AuthToken>, configService: ConfigService);
    getTokens(): Promise<AuthToken>;
    saveTokens(accessToken: string, refreshToken: string, expiresAt: number): Promise<AuthToken>;
    refreshAccessToken(accessToken: string, refreshToken: string, expiresAt: number): Promise<void>;
}
