import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  code: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @IsBoolean()
  isDeleted: boolean;
}
