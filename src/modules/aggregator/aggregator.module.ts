import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { Aggregator } from './entities/aggregator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from 'src/auth/jwt-auth.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aggregator, User]), JwtAuthModule],
  controllers: [AggregatorController],
  providers: [AggregatorService],
  exports: [AggregatorService]
})
export class AggregatorModule { }
