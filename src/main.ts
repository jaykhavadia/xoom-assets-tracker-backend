import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically remove properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to be objects of the expected type
  }));

  await app.listen(3000);
}
bootstrap();
