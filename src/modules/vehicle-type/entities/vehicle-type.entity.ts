import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';

export enum Fuel {
  ICE = 'ICE',
  CNG = 'CNG',
  Hybrid = 'Hybrid',
}

@Entity('vehicle_type')
@Unique(['name', 'fuel'])  // Composite unique constraint on name and fuel
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
