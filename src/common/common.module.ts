import { Module } from '@nestjs/common';
import { UploadService } from './upload/upload.service';
import { FilesHelperService } from './files-helper/files-helper.service';

@Module({
  providers: [UploadService, FilesHelperService],
  exports: [UploadService],
})
export class CommonModule {}
