import { Module } from '@nestjs/common';
import { UploadService } from './upload/upload.service';
import { FilesHelperService } from './files-helper/files-helper.service';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './auth-token/auth-token.entity';
import { AuthTokenService } from './auth-token/auth-token.service';
import { VehicleType } from 'src/modules/vehicle-type/entities/vehicle-type.entity';
import { Model } from 'src/modules/model/entities/model.entity';
import { OwnedBy } from 'src/modules/owned-by/entities/owned_by.entity';
import { Aggregator } from 'src/modules/aggregator/entities/aggregator.entity';
import { Vehicle } from 'src/modules/vehicle/entities/vehical.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken, VehicleType, Model, OwnedBy, Aggregator, Vehicle, Employee, Location, Transaction])],
  providers: [UploadService, FilesHelperService, GoogleAuthService, GoogleDriveService, AuthTokenService],
  exports: [UploadService, GoogleDriveService, FilesHelperService, AuthTokenService],
})
export class CommonModule { }
