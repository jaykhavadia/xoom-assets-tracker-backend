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

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Transaction, Employee, Location, User]), CommonModule, VehicleModule, EmployeeModule, LocationModule, JwtAuthModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
