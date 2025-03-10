import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsDate,
  Matches,
  IsOptional,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import * as moment from "moment"; // Corrected import
import { Emirates } from "../entities/vehical.entity";

export class VehicleDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  vehicleNo: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  vehicleTypeId: number;

  @IsNotEmpty()
  modelId: number;

  @IsNotEmpty()
  ownedById: number;

  @IsOptional()
  aggregatorId: number;

  @Transform(({ value }) => {
    return value ? moment(value, "DD-MM-YYYY").format("DD-MM-YYYY") : null;
  })
  @IsNotEmpty()
  registrationExpiry: Date;

  @IsEnum(Emirates)
  emirates: Emirates;

  @IsString()
  @IsNotEmpty()
  chasisNumber: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(["available", "occupied"])
  status: "available" | "occupied";

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsBoolean()
  isDeleted: boolean;
}
