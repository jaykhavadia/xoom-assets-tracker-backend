import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, IsNotEmpty, IsDateString, IsUrl } from 'class-validator';

@Entity()
export class Sheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  uploadedAt: Date;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  @IsNotEmpty()
  uploadedAtTime: string; // Example: '10:30 AM'

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fileUrl: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  type: string;
}
