import { OwnedByService } from './owned-by.service';
import { OwnedBy } from './entities/owned_by.entity';
export declare class OwnedByController {
    private readonly ownedByService;
    private readonly logger;
    constructor(ownedByService: OwnedByService);
    create(ownedBy: Partial<OwnedBy>): Promise<response<OwnedBy>>;
    findAll(): Promise<response<OwnedBy[]>>;
    findOne(id: number): Promise<response<OwnedBy>>;
    update(id: number, updateData: Partial<OwnedBy>): Promise<response<OwnedBy>>;
    remove(id: number): Promise<response<null>>;
}
