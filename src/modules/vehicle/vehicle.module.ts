import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehical.entity';
import { SheetService } from '../sheet/sheet.service';
import { SheetModule } from '../sheet/sheet.module';
import { Sheet } from '../sheet/entities/sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Sheet]), CommonModule, SheetModule],
  controllers: [VehicleController],
  providers: [VehicleService, SheetService],
})
export class VehicleModule { }
