import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Aggregator } from '../../aggregator/entities/aggregator.entity';

// Define the enum for picture position
export enum PicturePosition {
  BACK = 'back',
  FRONT = 'front',
  LEFT = 'left',
  RIGHT = 'right',
}

// Define the enum for action types
export enum Action {
  IN = 'in',
  OUT = 'out',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'enum', enum: Action, nullable: false })
  action: Action; // Add action column with Action enum type

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

  @Column({type: 'text', nullable: true})
  aggregator: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
