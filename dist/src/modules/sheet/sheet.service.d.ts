import { Sheet } from './entities/sheet.entity';
import { Repository } from 'typeorm';
export declare class SheetService {
    private sheetRepository;
    private readonly logger;
    constructor(sheetRepository: Repository<Sheet>);
    create(sheet: Partial<Sheet>): Promise<Sheet>;
    findAll(): Promise<Sheet[]>;
    findOne(id: number): Promise<Sheet>;
    update(id: number, sheet: Sheet): Promise<Sheet>;
    remove(id: number): Promise<void>;
}
