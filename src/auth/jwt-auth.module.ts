// src/auth/jwt-auth.module.ts
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // Register User entity for repository injection
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '2d' },
            }),
        }),
    ],
    providers: [
        JwtAuthGuard, // Guard for protecting routes
        UserService,  // Service for user data
    ],
    exports: [
        JwtAuthGuard,  // Export guard for use in other modules
        JwtModule,     // Export JwtModule for token-related operations
    ],
})
export class JwtAuthModule { }
