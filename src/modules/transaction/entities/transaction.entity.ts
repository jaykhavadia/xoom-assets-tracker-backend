import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, ManyToOne } from 'typeorm';

// Define the enum for picture position
export enum PicturePosition {
  BACK = 'back',
  FRONT = 'front',
  LEFT = 'left',
  RIGHT = 'right',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  // Updated pictures array with position as enum
  @Column({ type: 'json', nullable: true })
  pictures: Array<{ url: string; position?: PicturePosition }>;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.transactions, { cascade: true })
  vehicle: Vehicle;

  @ManyToOne(() => Employee, (employee) => employee.transactions, { cascade: true })
  employee: Employee;

  @ManyToOne(() => Location, (location) => location.transactions, { cascade: true })
  location: Location;
}

