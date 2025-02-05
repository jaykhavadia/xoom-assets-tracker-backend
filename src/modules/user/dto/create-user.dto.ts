import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsDate, Matches, IsOptional, IsEmail } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import * as moment from 'moment'; // Corrected import
import { Column } from 'typeorm';
import { Role } from '../entities/user.entity';

export class UserDto {
      @IsString()
      @IsNotEmpty()
      firstName: string;
    
      @IsString()
      @IsNotEmpty()
      lastName: string;
    
      
      @IsEnum(Role)
      @IsString()
      @IsNotEmpty()
      role: Role;
    
      @IsEmail()
      @IsNotEmpty()
      email: string;
    
      @IsString()
      @IsNotEmpty()
      password: string;

}
