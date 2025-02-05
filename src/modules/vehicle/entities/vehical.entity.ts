import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique
} from 'typeorm';
import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsDate, Matches } from 'class-validator';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { VehicleType } from 'src/modules/vehicle-type/entities/vehicle-type.entity';
import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
import { Model } from 'src/modules/model/entities/model.entity';
import * as moment from 'moment';

export enum Emirates {
  AbuDhabi = 'AbuDhabi',
  Dubai = 'Dubai',
  Sharjah = 'Sharjah',
  Ajman = 'Ajman',
  Fujairah = 'Fujairah',
  RasAlKhaimah = 'RasAlKhaimah',
  UmmAlQuwain = 'UmmAlQuwain',
}

@Entity('vehicle')
@Unique(['chasisNumber']) // Ensures chasisNumber is unique
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'vehicleNo', type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  vehicleNo: string;
  
  @Column({ name: 'code', type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType, { eager: true, cascade: true })
  vehicleType: VehicleType;

  @ManyToOne(() => Model, (Model) => Model, { eager: true, cascade: true })
  model: Model;

  @ManyToOne(() => OwnedBy, (ownedBy) => ownedBy, { eager: true, cascade: true })
  ownedBy: OwnedBy;

  @ManyToOne(() => Aggregator, (aggregator) => aggregator, { eager: true, cascade: true })
  aggregator: Aggregator;

  @Column({
    type: 'date',
    nullable: true,
    transformer: {
      to(value: Date): Date {
        // Convert string (dd-mm-yyyy) to a Date object
        return value ? moment(value, 'DD-MM-YYYY').toDate() : value;
      },
      from(value: Date): string {
        // Convert Date object to dd-mm-yyyy format
        return value ? moment(value).format('DD-MM-YYYY') : null;
      },
    },
  })
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Date must be in the format dd-mm-yyyy',
  }) // Validates input format
  registrationExpiry: Date;

  @Column({ type: 'enum', enum: Emirates })
  @IsEnum(Emirates)
  @IsNotEmpty()
  emirates: Emirates;

  @Column({ name: 'chasisNumber', type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  chasisNumber: string;
  
  @Column({ type: 'varchar', length: 50 })
  @IsString()
  @IsNotEmpty()
  location: string;

  @Column({ type: 'enum', enum: ['available', 'occupied'] })
  @IsEnum(['available', 'occupied'])
  status: 'available' | 'occupied';

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @IsBoolean()
  isDeleted: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.vehicle)
  transactions: Transaction[];
}
