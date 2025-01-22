import { ConfigService } from '@nestjs/config';
export declare const googleConfig: (configService: ConfigService) => {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
};
