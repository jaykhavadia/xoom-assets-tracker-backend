import { AggregatorService } from './aggregator.service';
import { Aggregator } from './entities/aggregator.entity';
export declare class AggregatorController {
    private readonly aggregatorService;
    private readonly logger;
    constructor(aggregatorService: AggregatorService);
    create(aggregator: Partial<Aggregator>): Promise<response<Aggregator>>;
    findAll(): Promise<response<Aggregator[]>>;
    findOne(id: number): Promise<response<Aggregator>>;
    update(id: number, updateData: Partial<Aggregator>): Promise<response<Aggregator>>;
    remove(id: number): Promise<response<null>>;
}
