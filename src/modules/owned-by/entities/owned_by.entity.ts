// src/modules/owned-by/entities/owned-by.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';

@Entity('owned_by')
export class OwnedBy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.ownedBy)
  vehicles: Vehicle[];
}
