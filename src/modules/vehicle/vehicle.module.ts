import { Module } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { VehicleController } from "./vehicle.controller";
import { CommonModule } from "src/common/common.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vehicle } from "./entities/vehical.entity";
import { SheetService } from "../sheet/sheet.service";
import { SheetModule } from "../sheet/sheet.module";
import { Sheet } from "../sheet/entities/sheet.entity";
import { VehicleType } from "../vehicle-type/entities/vehicle-type.entity";
import { Model } from "../model/entities/model.entity";
import { OwnedBy } from "../owned-by/entities/owned_by.entity";
import { Aggregator } from "../aggregator/entities/aggregator.entity";
import { JwtAuthModule } from "src/auth/jwt-auth.module";
import { User } from "../user/entities/user.entity";
import { VehicleQueryService } from "./vehicleQuery.service";
import { Transaction } from "../transaction/entities/transaction.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      Sheet,
      VehicleType,
      Model,
      OwnedBy,
      Aggregator,
      User,
      Transaction,
    ]),
    CommonModule,
    SheetModule,
    JwtAuthModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService, SheetService, VehicleQueryService],
  exports: [VehicleService, VehicleQueryService],
})
export class VehicleModule {}
