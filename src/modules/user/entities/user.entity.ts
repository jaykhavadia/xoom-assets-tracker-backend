import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Role {
  Viewer = 'Viewer',
  Editor = 'Editor',
  Owner = 'Owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Viewer,
  })
  @IsEnum(Role)
  @IsString()
  @IsNotEmpty()
  role: Role;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;
}
