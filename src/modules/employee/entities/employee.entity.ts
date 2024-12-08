import { IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  code: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @IsBoolean()
  isDeleted: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.employee)
  transactions: Transaction[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsString()
  currentVehicle: string;
}
