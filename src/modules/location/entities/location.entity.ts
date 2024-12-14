import { IsNotEmpty, IsString } from 'class-validator';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ name: 'FullAddress', type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @OneToMany(() => Transaction, (transaction) => transaction.location)
  transactions: Transaction[];
}
