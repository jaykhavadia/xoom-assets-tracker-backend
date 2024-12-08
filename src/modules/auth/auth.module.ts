// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';

@Module({
  imports: [
    UserModule,
    JwtAuthModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
