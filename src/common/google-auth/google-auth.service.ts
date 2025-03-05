// google-auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { googleConfig } from 'google.config';
import { AuthTokenService } from '../auth-token/auth-token.service';

@Injectable()
export class GoogleAuthService {
  private oAuth2Client;
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(private configService: ConfigService, private authTokenService: AuthTokenService) {
    const { clientId, clientSecret, redirectUri } = googleConfig(this.configService);
    this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  /**
   * Generates an authorization URL for the user to consent to the application.
   * @returns The authorization URL
   */
  generateAuthUrl(): string {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.file'],
      prompt: 'consent', // Ensures that a refresh token is returned
    });
    this.logger.log('Generated authorization URL: ' + authUrl);
    return authUrl;
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   * @param code The authorization code received from the consent screen
   * @returns The tokens object containing access and refresh tokens
   */
  async getTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);
      this.logger.log('Tokens obtained successfully');
      return tokens;
    } catch (error) {
      this.logger.error('Error exchanging code for tokens: ' + error.message);
      throw error;
    }
  }

  /**
   * Sets the OAuth2 client credentials with an access token and refresh token.
   * @param accessToken The access token
   * @param refreshToken The refresh token
   */
  setCredentials(accessToken: string, refreshToken: string): void {
    this.oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.logger.log('OAuth2 client credentials set');
  }
 
  /**
   * Refreshes the access token using the refresh token.
   * @returns The refreshed tokens object
   */
  async refreshAccessToken(): Promise<void> {
    try {
      const tokens = await this.oAuth2Client.getAccessToken();

      if (tokens?.token) {
        const expirationTime = Date.now() + 3600 * 1000;
        await this.authTokenService.saveTokens(tokens.token, this.oAuth2Client.credentials.refresh_token, expirationTime);
        this.logger.log('Access token refreshed and saved successfully');
      }
    } catch (error) {
      this.logger.error('Error refreshing access token: ' + error.message);
      throw error;
    }
  }

  /**
   * Returns the OAuth2 client instance.
   * @returns The OAuth2 client
   */
  getOAuth2Client() {
    return this.oAuth2Client;
  }
}
