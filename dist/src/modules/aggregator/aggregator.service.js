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
var AggregatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aggregator_entity_1 = require("./entities/aggregator.entity");
const messages_constants_1 = require("../../constants/messages.constants");
let AggregatorService = AggregatorService_1 = class AggregatorService {
    constructor(aggregatorRepository) {
        this.aggregatorRepository = aggregatorRepository;
        this.logger = new common_1.Logger(AggregatorService_1.name);
    }
    async create(aggregator) {
        try {
            const newAggregator = this.aggregatorRepository.create(aggregator);
            return await this.aggregatorRepository.save(newAggregator);
        }
        catch (error) {
            this.logger.error('[AggregatorService] [create] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.aggregator.createFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            return await this.aggregatorRepository.find();
        }
        catch (error) {
            this.logger.error('[AggregatorService] [findAll] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.aggregator.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            return await this.aggregatorRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('[AggregatorService] [findOne] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.aggregator.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOneByName(name) {
        try {
            return await this.aggregatorRepository.findOne({ where: { name: name || "idle" } });
        }
        catch (error) {
            this.logger.error('[AggregatorService] [findOne] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.aggregator.fetchFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateData) {
        try {
            await this.aggregatorRepository.update(id, updateData);
            return this.findOne(id);
        }
        catch (error) {
            this.logger.error('[AggregatorService] [update] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.aggregator.updateFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.aggregatorRepository.delete(id);
            return { message: 'Aggregator deleted successfully.' };
        }
        catch (error) {
            this.logger.error('[AggregatorService] [remove] Error:', error);
            throw new common_1.HttpException(messages_constants_1.Messages.aggregator.deleteFailure, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AggregatorService = AggregatorService;
exports.AggregatorService = AggregatorService = AggregatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(aggregator_entity_1.Aggregator)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AggregatorService);
//# sourceMappingURL=aggregator.service.js.map