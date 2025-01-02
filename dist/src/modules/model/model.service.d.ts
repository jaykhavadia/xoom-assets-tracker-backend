import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
export declare class ModelService {
    private readonly modelRepository;
    private readonly logger;
    constructor(modelRepository: Repository<Model>);
    create(model: Partial<Model>): Promise<Model>;
    findAll(): Promise<Model[]>;
    findOne(id: number): Promise<Model>;
    update(id: number, updateData: Partial<Model>): Promise<Model>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
