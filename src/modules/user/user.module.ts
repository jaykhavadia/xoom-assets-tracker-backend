// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtAuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
