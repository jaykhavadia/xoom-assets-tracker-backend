import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CronService {
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
}
