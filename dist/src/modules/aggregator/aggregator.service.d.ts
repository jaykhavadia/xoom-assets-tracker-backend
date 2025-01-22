import { Repository } from 'typeorm';
import { Aggregator } from './entities/aggregator.entity';
export declare class AggregatorService {
    private readonly aggregatorRepository;
    private readonly logger;
    constructor(aggregatorRepository: Repository<Aggregator>);
    create(aggregator: Partial<Aggregator>): Promise<Aggregator>;
    findAll(): Promise<Aggregator[]>;
    findOne(id: number): Promise<Aggregator>;
    findOneByName(name: string): Promise<Aggregator>;
    update(id: number, updateData: Partial<Aggregator>): Promise<Aggregator>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
