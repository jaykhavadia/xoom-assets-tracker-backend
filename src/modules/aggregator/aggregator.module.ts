import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { Aggregator } from './entities/aggregator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Aggregator])],
  controllers: [AggregatorController],
  providers: [AggregatorService],
})
export class AggregatorModule {}
