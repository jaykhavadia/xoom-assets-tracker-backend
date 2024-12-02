// src/modules/aggregator/entities/aggregator.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';

@Entity('aggregator')
export class Aggregator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Idel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.aggregator)
  vehicles: Vehicle[];
}