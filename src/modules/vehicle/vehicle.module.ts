import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehical.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]),CommonModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule { }
