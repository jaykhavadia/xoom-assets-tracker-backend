// src/modules/vehicle-type/entities/vehicle-type.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';

enum Fuel {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  CNG = 'CNG',
  Hybrid = 'Hybrid',
}

@Entity('vehicle_type')
export class VehicleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'enum',
    enum: Fuel,
  })
  @IsEnum(Fuel)
  @IsNotEmpty()
  fuel: Fuel;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleType)
  vehicles: Vehicle[];
}
