import { Repository } from 'typeorm';
import { OwnedBy } from './entities/owned_by.entity';
export declare class OwnedByService {
    private readonly ownedByRepository;
    private readonly logger;
    constructor(ownedByRepository: Repository<OwnedBy>);
    create(ownedBy: Partial<OwnedBy>): Promise<OwnedBy>;
    findAll(): Promise<OwnedBy[]>;
    findOne(id: number): Promise<OwnedBy>;
    update(id: number, updateData: Partial<OwnedBy>): Promise<OwnedBy>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
