import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { EmployeeModule } from './modules/employee/employee.module';
import { LocationModule } from './modules/location/location.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { Vehicle } from './modules/vehicle/entities/vehical.entity';
import { Location } from './modules/location/entities/location.entity';
import { Employee } from './modules/employee/entities/employee.entity';
import { Transaction } from './modules/transaction/entities/transaction.entity';
import { CommonModule } from './common/common.module';
import { SheetModule } from './modules/sheet/sheet.module';
import { Sheet } from './modules/sheet/entities/sheet.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cronservice';
import { AuthToken } from './common/auth-token/auth-token.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/entities/user.entity';
import { VehicleTypeModule } from './modules/vehicle-type/vehicle-type.module';
import { AggregatorModule } from './modules/aggregator/aggregator.module';
import { ModelModule } from './modules/model/model.module';
import { OwnedByModule } from './modules/owned-by/owned-by.module';
import { Aggregator } from './modules/aggregator/entities/aggregator.entity';
import { OwnedBy } from './modules/owned-by/entities/owned_by.entity';
import { Model } from './modules/model/entities/model.entity';
import { VehicleType } from './modules/vehicle-type/entities/vehicle-type.entity';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your public folder
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [Vehicle, Location, Employee, Transaction, Sheet, AuthToken, User, VehicleType, Model, OwnedBy, Aggregator],
        synchronize: true, // Set to false in production
      }),
      async dataSourceFactory(options) {
        const dataSource = await new DataSource(options).initialize();
        console.log('Successfully connected to the database!', dataSource.options);
        return dataSource;
      },
    }),
    ScheduleModule.forRoot(),
    VehicleModule,
    EmployeeModule,
    LocationModule,
    TransactionModule,
    CommonModule,
    SheetModule,
    UserModule,
    AuthModule,
    VehicleTypeModule,
    AggregatorModule,
    ModelModule,
    OwnedByModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule { }
