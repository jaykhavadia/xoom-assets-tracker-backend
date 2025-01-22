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
var OwnedByService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnedByService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const owned_by_entity_1 = require("./entities/owned_by.entity");
const messages_constants_1 = require("../../constants/messages.constants");
let OwnedByService = OwnedByService_1 = class OwnedByService {
    constructor(ownedByRepository) {
        this.ownedByRepository = ownedByRepository;
        this.logger = new common_1.Logger(OwnedByService_1.name);
    }
    async create(ownedBy) {
        try {
            const newOwnedBy = this.ownedByRepository.create(ownedBy);
            return await this.ownedByRepository.save(newOwnedBy);
        }
        catch (error) {
            this.logger.error('[OwnedByService] [create] Error:', error);
            throw new common_1.HttpException(error.Messages, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            return await this.ownedByRepository.find();
        }
        catch (error) {
            this.logger.error('[OwnedByService] [findAll] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.ownedBy.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            return await this.ownedByRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('[OwnedByService] [findOne] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.ownedBy.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            await this.ownedByRepository.update(id, updateData);
            return this.findOne(id);
        }
        catch (error) {
            this.logger.error('[OwnedByService] [update] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.ownedBy.updateFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.ownedByRepository.delete(id);
            return { message: 'OwnedBy deleted successfully.' };
        }
        catch (error) {
            this.logger.error('[OwnedByService] [remove] Error:', error);
            throw new common_1.HttpException(error.Messages, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.OwnedByService = OwnedByService;
exports.OwnedByService = OwnedByService = OwnedByService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(owned_by_entity_1.OwnedBy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OwnedByService);
//# sourceMappingURL=owned-by.service.js.map