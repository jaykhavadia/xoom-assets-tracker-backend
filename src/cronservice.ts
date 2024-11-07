import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { AuthTokenService } from './common/auth-token/auth-token.service';

@Injectable()
export class CronService {

    constructor(private readonly authTokenService: AuthTokenService) {

    }

    // Set up the cron job to run every 30 seconds
    @Cron('*/30 * * * * *') // This cron expression means every 30 seconds
    async handleCron() {
        try {
            const response = await axios.get(process.env.API_URL); // Replace with your actual root endpoint
            console.log('Root endpoint response:', response.data);
        } catch (error) {
            console.error('Error calling root endpoint:', error.message);
        }
    }

    // Cron job to refresh the access token every hour
    @Cron('0 * * * *') // Runs at the start of every hour
    async refreshAccessToken() {
        const url = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams();
        params.append('client_id', process.env.GOOGLE_CLIENT_ID);
        params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        params.append('refresh_token', process.env.GOOGLE_REFRESH_TOKEN);
        params.append('grant_type', 'refresh_token');

        try {
            const response = await axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token, expires_in } = response.data;
            this.authTokenService.saveTokens(access_token, process.env.GOOGLE_REFRESH_TOKEN, expires_in);
            console.log('Access token refreshed successfully');
        } catch (error) {
            console.error('Error refreshing access token:', error.message);
        }
    }
}
