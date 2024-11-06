import { IsString, IsDateString, IsNumberString, IsNotEmpty, IsEnum } from 'class-validator';

export enum Action {
    ENTRY = 'entry',
    EXIT = 'exit',
}

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

    @IsNumberString()
    @IsNotEmpty()
    vehicle: number;

    @IsString()
    @IsNotEmpty()
    time: string;
}
