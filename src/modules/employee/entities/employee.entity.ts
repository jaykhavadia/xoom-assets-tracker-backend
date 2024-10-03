import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
