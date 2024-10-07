import { Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sheet } from './entities/sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sheet])],
  controllers: [SheetController],
  providers: [SheetService],
  exports: [SheetService]
})
export class SheetModule { }
