import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { CommonModule } from 'src/common/common.module';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SheetModule } from '../sheet/sheet.module';
import { SheetService } from '../sheet/sheet.service';
import { Sheet } from '../sheet/entities/sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Sheet]),CommonModule, SheetModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, SheetService],
})
export class EmployeeModule {}
