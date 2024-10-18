// google.config.ts
import { ConfigService } from '@nestjs/config';

export const googleConfig = (configService: ConfigService) => ({
  clientId: configService.get<string>('GOOGLE_CLIENT_ID'),
  clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
  redirectUri: configService.get<string>('GOOGLE_REDIRECT_URI'),
});
