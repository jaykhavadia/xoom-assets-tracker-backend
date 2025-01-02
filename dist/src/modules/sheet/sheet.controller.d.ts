import { SheetService } from './sheet.service';
import { Sheet } from './entities/sheet.entity';
export declare class SheetController {
    private readonly sheetService;
    private readonly logger;
    constructor(sheetService: SheetService);
    create(sheet: Sheet): Promise<response<Sheet>>;
    findAll(): Promise<response<Sheet[]>>;
    findOne(id: string): Promise<response<Sheet>>;
    update(id: string, sheet: Sheet): Promise<response<Sheet>>;
    remove(id: string): Promise<response<void>>;
}
