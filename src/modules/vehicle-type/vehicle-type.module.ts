import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleType } from './entities/vehicle-type.entity';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleType, User]), JwtAuthModule],
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService],
})
export class VehicleTypeModule {}
