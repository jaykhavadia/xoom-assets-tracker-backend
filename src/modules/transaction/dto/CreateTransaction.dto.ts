import { IsString, IsDateString, IsNumberString, IsNotEmpty, IsEnum } from 'class-validator';
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
    @IsNotEmpty()
    time: string;
}
