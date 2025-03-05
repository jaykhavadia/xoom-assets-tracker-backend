// src/auth-token.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from './auth-token.entity';  // Ensure you import the AuthToken entity
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthTokenService {
  private readonly logger = new Logger(AuthTokenService.name);

  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>, // Injecting the repository
    private readonly configService: ConfigService
  ) {}

  /**
   * Retrieves the stored token from the database.
   * @returns The token record or null if not found.
   */
  async getTokens(): Promise<AuthToken> {
    try {
      let token = await this.authTokenRepository.findOne({ where: { id: 1 } });
      if (!token) {
        this.logger.warn('No tokens found in the database.');
        token = await this.saveTokens(this.configService.get('GOOGLE_ACCESS_TOKEN'), this.configService.get('GOOGLE_REFRESH_TOKEN'), 3400);
      }
      return token;
    } catch (error) {
      this.logger.error('Error fetching tokens from the database:', error);
      throw error;
    }
  }

  /**
   * Saves or updates the access and refresh tokens.
   * @param accessToken The access token.
   * @param refreshToken The refresh token.
   * @param expiresAt The expiration time of the access token (timestamp).
   */
  async saveTokens(accessToken: string, refreshToken: string, expiresAt: number): Promise<AuthToken> {
    try {
      let tokenRecord = await this.authTokenRepository.findOne({ where: { id: 1 } });

      // If token record exists, update it, otherwise create a new one.
      if (tokenRecord) {
        tokenRecord.accessToken = accessToken;
        tokenRecord.refreshToken = refreshToken;
        tokenRecord.accessTokenExpiresAt = expiresAt;
      } else {
        tokenRecord = this.authTokenRepository.create({
          accessToken,
          refreshToken,
          accessTokenExpiresAt: expiresAt,
        });

      }

      this.logger.log('Tokens saved/updated successfully');
      return await this.authTokenRepository.save(tokenRecord);
    } catch (error) {
      this.logger.error('Error saving tokens to the database:', error);
      throw error;
    }
  }

  /**
   * Refreshes the access token and updates it in the database.
   * @param accessToken The new access token.
   * @param refreshToken The current refresh token.
   * @param expiresAt The expiration time of the new access token (timestamp).
   */
  async refreshAccessToken(accessToken: string, refreshToken: string, expiresAt: number): Promise<void> {
    await this.saveTokens(accessToken, refreshToken, expiresAt); // Update the tokens
  }
}
