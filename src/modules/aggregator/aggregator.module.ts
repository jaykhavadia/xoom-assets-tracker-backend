import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';

@Module({
  controllers: [AggregatorController],
  providers: [AggregatorService],
})
export class AggregatorModule {}
