import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pictures: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;

  @ManyToOne(() => Employee, (employee) => employee.id)
  employee: Employee;

  @ManyToOne(() => Location, (location) => location.id)
  location: Location;
}
