import { Module } from '@nestjs/common';
import { OwnedByService } from './owned-by.service';
import { OwnedByController } from './owned-by.controller';
import { OwnedBy } from './entities/owned_by.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OwnedBy])],
  controllers: [OwnedByController],
  providers: [OwnedByService],
})
export class OwnedByModule {}
