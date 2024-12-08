import { Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sheet } from './entities/sheet.entity';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sheet, User]), JwtAuthModule],
  controllers: [SheetController],
  providers: [SheetService],
  exports: [SheetService]
})
export class SheetModule { }
