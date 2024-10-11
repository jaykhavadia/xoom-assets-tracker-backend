import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn() // Automatically generates an ID
  id: number;

  @Column({ name: 'VehicleNo', type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  vehicleNo: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  model: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  from: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @IsBoolean()
  isDeleted: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.vehicle)
  transactions: Transaction[];
}
