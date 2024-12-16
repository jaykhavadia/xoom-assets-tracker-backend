import { IsString, IsDateString, IsNumberString, IsNotEmpty, IsEnum, IsOptional, IsEmpty, IsArray } from 'class-validator';
import { Action } from '../entities/transaction.entity';

export class CreateTransactionDto {
    @IsString()
    comments: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsEnum(Action, { message: 'Action must be either entry or exit' })
    @IsNotEmpty()
    action: Action;

    @IsNumberString()
    @IsNotEmpty()
    employee: number;

    @IsNumberString()
    @IsNotEmpty()
    location: number;

    @IsString()
    @IsNotEmpty()
    vehicle: string;

    @IsString()
    @IsOptional()
    aggregator?: string;

    @IsString()
    @IsNotEmpty()
    time: string;
}

export class UpdateTransactionDto {
    @IsString()
    comments: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    // @IsEnum(Action, { message: 'Action must be either entry or exit' })
    @IsEmpty({ message: "Can't update action" })
    action: Action;

    @IsNumberString()
    @IsNotEmpty()
    employee: number;

    @IsNumberString()
    @IsNotEmpty()
    location: number;

    // @IsString()
    @IsEmpty({ message: "Can't update vehicle" })
    vehicle: string;

    @IsString()
    @IsOptional()
    aggregator?: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsArray()
    @IsOptional()
    pictures: [];
}
