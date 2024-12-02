import { Module } from '@nestjs/common';
import { OwnedByService } from './owned-by.service';
import { OwnedByController } from './owned-by.controller';

@Module({
  controllers: [OwnedByController],
  providers: [OwnedByService],
})
export class OwnedByModule {}
