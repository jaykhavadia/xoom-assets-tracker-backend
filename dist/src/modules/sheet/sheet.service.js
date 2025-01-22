"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SheetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetService = void 0;
const common_1 = require("@nestjs/common");
const sheet_entity_1 = require("./entities/sheet.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let SheetService = SheetService_1 = class SheetService {
    constructor(sheetRepository) {
        this.sheetRepository = sheetRepository;
        this.logger = new common_1.Logger(SheetService_1.name);
    }
    async create(sheet) {
        try {
            return await this.sheetRepository.save(sheet);
        }
        catch (error) {
            this.logger.error(`[SheetService] [create] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to create sheet.');
        }
    }
    async findAll() {
        try {
            return await this.sheetRepository.find();
        }
        catch (error) {
            this.logger.error(`[SheetService] [findAll] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to retrieve sheets.');
        }
    }
    async findOne(id) {
        try {
            return await this.sheetRepository.findOneBy({ id });
        }
        catch (error) {
            this.logger.error(`[SheetService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to find sheet with id: ${id}`);
        }
    }
    async update(id, sheet) {
        try {
            await this.sheetRepository.update(id, sheet);
            return await this.findOne(id);
        }
        catch (error) {
            this.logger.error(`[SheetService] [update] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to update sheet with id: ${id}`);
        }
    }
    async remove(id) {
        try {
            let sheet = await this.findOne(id);
            if (!sheet) {
                throw new common_1.InternalServerErrorException(`No data with id: ${id}`);
            }
            await this.sheetRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`[SheetService] [remove] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to delete sheet with id: ${id}`);
        }
    }
};
exports.SheetService = SheetService;
exports.SheetService = SheetService = SheetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(sheet_entity_1.Sheet)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SheetService);
//# sourceMappingURL=sheet.service.js.map