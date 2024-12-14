import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../vehicle/entities/vehical.entity';
import { Transaction } from './entities/transaction.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Location } from '../location/entities/location.entity';
import { VehicleModule } from '../vehicle/vehicle.module';
import { EmployeeModule } from '../employee/employee.module';
import { LocationModule } from '../location/location.module';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';
import { Aggregator } from '../aggregator/entities/aggregator.entity';
import { AggregatorModule } from '../aggregator/aggregator.module';
import { SheetModule } from '../sheet/sheet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Transaction, Employee, Location, User, Aggregator]), CommonModule, VehicleModule, EmployeeModule, LocationModule, JwtAuthModule, AggregatorModule, SheetModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
