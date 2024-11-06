import { Module } from '@nestjs/common';
import { UploadService } from './upload/upload.service';
import { FilesHelperService } from './files-helper/files-helper.service';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './auth-token/auth-token.entity';
import { AuthTokenService } from './auth-token/auth-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken])],
  providers: [UploadService, FilesHelperService, GoogleAuthService, GoogleDriveService,  AuthTokenService],
  exports: [UploadService, GoogleDriveService, FilesHelperService,  AuthTokenService],
})
export class CommonModule { }
