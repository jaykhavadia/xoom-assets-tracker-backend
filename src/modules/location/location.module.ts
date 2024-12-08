import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, User]), JwtAuthModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService]
})
export class LocationModule { }
