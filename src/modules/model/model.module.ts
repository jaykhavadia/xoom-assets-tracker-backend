import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { Model } from './entities/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model, User]), JwtAuthModule],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
