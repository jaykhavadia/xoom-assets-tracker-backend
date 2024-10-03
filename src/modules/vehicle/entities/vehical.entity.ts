import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn() // Automatically generates an ID
  id: number;

  @Column({ name: 'VehicleNo', type: 'varchar', length: 50 })
  vehicleNo: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 100 })
  from: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
