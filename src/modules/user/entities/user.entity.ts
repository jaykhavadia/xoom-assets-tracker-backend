import { Exclude } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Transaction } from "src/modules/transaction/entities/transaction.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

export enum Role {
  Viewer = "Viewer",
  Editor = "Editor",
  Owner = "Owner",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
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
    type: "enum",
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

  @Exclude()
  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
