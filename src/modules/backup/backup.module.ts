import { Module } from "@nestjs/common";
import { BackupService } from "./backup.service";
import { BackupController } from "./backup.controller";
import { EmployeeService } from "../employee/employee.service";
import { Employee } from "../employee/entities/employee.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [BackupController],
  providers: [BackupService, EmployeeService],
  exports: [BackupService],
})
export class BackupModule {}
