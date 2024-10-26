import { IsString, IsDateString, IsNumberString, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    comments: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

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
