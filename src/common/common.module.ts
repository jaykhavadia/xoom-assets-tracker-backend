import { Module } from '@nestjs/common';
import { UploadService } from './upload/upload.service';
import { FilesHelperService } from './files-helper/files-helper.service';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleDriveService } from './google-drive/google-drive.service';

@Module({
  providers: [UploadService, FilesHelperService, GoogleAuthService, GoogleDriveService],
  exports: [UploadService, GoogleDriveService],
})
export class CommonModule {}
