import {
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsNumber,
} from "class-validator";
import { Vehicle } from "src/modules/vehicle/entities/vehical.entity";

export class EmployeeWithVehicleDTO {
  @IsNumber()
  id: number;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  status: "active" | "inactive";

  @IsBoolean()
  isDeleted: boolean;

  @IsObject()
  @IsOptional()
  vehicle?: Partial<Vehicle>; // Allows partial vehicle data

  @IsString()
  @IsOptional()
  aggregator?: string;
}
