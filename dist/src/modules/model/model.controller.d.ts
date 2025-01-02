import { ModelService } from './model.service';
import { Model } from './entities/model.entity';
export declare class ModelController {
    private readonly modelService;
    private readonly logger;
    constructor(modelService: ModelService);
    create(model: Partial<Model>): Promise<response<Model>>;
    findAll(): Promise<response<Model[]>>;
    findOne(id: number): Promise<response<Model>>;
    update(id: number, updateData: Partial<Model>): Promise<response<Model>>;
    remove(id: number): Promise<response<null>>;
}
