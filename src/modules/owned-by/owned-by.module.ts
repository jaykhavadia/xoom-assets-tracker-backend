import { Module } from '@nestjs/common';
import { OwnedByService } from './owned-by.service';
import { OwnedByController } from './owned-by.controller';
import { OwnedBy } from './entities/owned_by.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OwnedBy, User]), JwtAuthModule],
  controllers: [OwnedByController],
  providers: [OwnedByService],
})
export class OwnedByModule { }
