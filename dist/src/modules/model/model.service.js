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
var ModelService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const model_entity_1 = require("./entities/model.entity");
const messages_constants_1 = require("../../constants/messages.constants");
let ModelService = ModelService_1 = class ModelService {
    constructor(modelRepository) {
        this.modelRepository = modelRepository;
        this.logger = new common_1.Logger(ModelService_1.name);
    }
    async create(model) {
        try {
            const newModel = this.modelRepository.create(model);
            return await this.modelRepository.save(newModel);
        }
        catch (error) {
            this.logger.error('[ModelService] [create] Error:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            return await this.modelRepository.find();
        }
        catch (error) {
            this.logger.error('[ModelService] [findAll] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.model.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            return await this.modelRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('[ModelService] [findOne] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.model.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            await this.modelRepository.update(id, updateData);
            return this.findOne(id);
        }
        catch (error) {
            this.logger.error('[ModelService] [update] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.model.updateFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.modelRepository.delete(id);
            return { message: 'Model deleted successfully.' };
        }
        catch (error) {
            this.logger.error('[ModelService] [remove] Error:', error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ModelService = ModelService;
exports.ModelService = ModelService = ModelService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModelService);
//# sourceMappingURL=model.service.js.map