import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsDate, Matches, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import * as moment from 'moment'; // Corrected import
import { Emirates } from '../entities/vehical.entity';

export class CreateVehicleDto {
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

    @IsNotEmpty()
    aggregatorId: number;

    @Transform(({ value }) => {
        console.log("🚀 ~ CreateVehicleDto ~ @Transform ~ value:", value)
        return value ? moment(value, 'DD-MM-YYYY').format('DD-MM-YYYY') : null;
    })
    @IsNotEmpty()
    registrationExpiry: string;

    @IsEnum(Emirates)
    emirates: Emirates;

    @IsString()
    @IsNotEmpty()
    chasisNumber: string;

    @IsEnum(['available', 'occupied'])
    status: 'available' | 'occupied';

    @IsBoolean()
    isDeleted: boolean;

    @IsString()
    @IsNotEmpty()
    from: string;
}
