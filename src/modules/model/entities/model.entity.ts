// src/modules/model/entities/model.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';

@Entity('model')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles: Vehicle[];
}
