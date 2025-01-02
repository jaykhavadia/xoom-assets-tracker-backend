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
var TransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const transaction_entity_1 = require("./entities/transaction.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const messages_constants_1 = require("../../constants/messages.constants");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const employee_service_1 = require("../employee/employee.service");
const location_service_1 = require("../location/location.service");
const date_fns_1 = require("date-fns");
const aggregator_service_1 = require("../aggregator/aggregator.service");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(transactionRepository, vehicleService, employeeService, locationService, aggregatorService) {
        this.transactionRepository = transactionRepository;
        this.vehicleService = vehicleService;
        this.employeeService = employeeService;
        this.locationService = locationService;
        this.aggregatorService = aggregatorService;
        this.logger = new common_1.Logger(TransactionService_1.name);
        this.convertTo24HourFormat = (time) => {
            const timeArray = time.split(/[:\s]/);
            let hours = parseInt(timeArray[0], 10);
            let minutes = timeArray[1], seconds, period;
            if (timeArray.length === 3) {
                seconds = "00";
                period = timeArray[2];
            }
            else {
                seconds = timeArray[2];
                period = timeArray[3];
            }
            if (period.toLowerCase() === 'am' && hours === 12) {
                hours = 0;
            }
            else if (period.toLowerCase() === 'pm' && hours !== 12) {
                hours += 12;
            }
            const formattedHour = hours.toString().padStart(2, '0');
            const formattedMinute = minutes.padStart(2, '0');
            const formattedSeconds = seconds.padStart(2, '0');
            return `${formattedHour}:${formattedMinute}:${formattedSeconds}`;
        };
    }
    async create(transactionDto) {
        try {
            const { employee, location, vehicle } = await this.updateTransactionRelation(transactionDto);
            let transaction = this.transactionRepository.create({
                date: transactionDto.date,
                time: this.convertTo24HourFormat(transactionDto.time),
                comments: transactionDto.comments,
                action: transactionDto.action,
                vehicle,
                employee,
                location,
                pictures: [],
            });
            transaction = await this.transactionRepository.save(transaction);
            return this.transactionRepository.findOne({
                where: { id: transaction.id },
                relations: ['vehicle', 'employee', 'location'],
            });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [create] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message || messages_constants_1.Messages.transaction.createFailure);
        }
    }
    async update(id, updateDto) {
        try {
            const { comments, date, employee, location, time } = updateDto;
            const transaction = await this.findOne(id);
            let vehicle = await this.vehicleService.findOne(transaction.vehicle.id);
            const aggregatorData = await this.aggregatorService.findOneByName(updateDto?.aggregator || 'idle');
            const { vehicleType, model, ownedBy, aggregator, ...vehicleData } = vehicle;
            vehicle = await this.vehicleService.update(vehicle.id, { ...vehicleData, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregatorData.id || 1), status: 'occupied' });
            const employeeData = await this.employeeService.findOne(updateDto.employee);
            if (employeeData.status === 'inactive') {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.inactive(employeeData.id));
            }
            const locationData = await this.locationService.findOne(updateDto.location);
            await this.transactionRepository.update({ id }, {
                comments,
                date, employee: employeeData, location: locationData, time
            });
            return this.transactionRepository.findOne({
                where: { id },
                relations: ['vehicle', 'employee', 'location'],
            });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [update] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(messages_constants_1.Messages.transaction.updateFailure(id));
        }
    }
    async updateTransaction(id, updateDto) {
        try {
            await this.transactionRepository.update({ id }, updateDto);
            return this.transactionRepository.findOne({
                where: { id },
                relations: ['vehicle', 'employee', 'location'],
            });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [update] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(messages_constants_1.Messages.transaction.updateFailure(id));
        }
    }
    async findOne(id) {
        try {
            return this.transactionRepository.findOne({
                where: { id },
                relations: ['vehicle', 'employee', 'location'],
            });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(messages_constants_1.Messages.transaction.findOneFailure(id));
        }
    }
    async findAll() {
        try {
            return await this.transactionRepository.find({ relations: ['vehicle', 'employee', 'location'] });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [findAll] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(messages_constants_1.Messages.transaction.findAllFailure);
        }
    }
    async remove(id) {
        try {
            await this.transactionRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`[TransactionService] [remove] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(messages_constants_1.Messages.transaction.removeFailure(id));
        }
    }
    async getTransactionsByDateRange(from, to, months, date) {
        const queryBuilder = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.vehicle', 'vehicle')
            .leftJoinAndSelect('transaction.employee', 'employee')
            .leftJoinAndSelect('transaction.location', 'location');
        if (date) {
            queryBuilder.andWhere('transaction.date = :date', { date });
        }
        if (from && to) {
            queryBuilder.andWhere('transaction.date BETWEEN :from AND :to', { from, to });
        }
        if (months && months > 0) {
            const startDate = (0, date_fns_1.format)((0, date_fns_1.subMonths)(new Date(), months), 'yyyy-MM-dd');
            const endDate = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
            queryBuilder.andWhere('transaction.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        if (!from && !to && !months) {
            const currentMonthStart = (0, date_fns_1.format)((0, date_fns_1.startOfMonth)(new Date()), 'yyyy-MM-dd');
            const currentMonthEnd = (0, date_fns_1.format)((0, date_fns_1.endOfMonth)(new Date()), 'yyyy-MM-dd');
            queryBuilder.andWhere('transaction.date BETWEEN :currentMonthStart AND :currentMonthEnd', {
                currentMonthStart,
                currentMonthEnd,
            });
        }
        queryBuilder.orderBy('transaction.date', 'DESC').addOrderBy('transaction.time', 'DESC');
        const transactions = await queryBuilder.getMany();
        if (!transactions.length) {
            throw new Error('No transactions found for the given filters.');
        }
        return transactions;
    }
    async createBulkTransactions(transaction) {
        try {
            this.logger.log('Starting updateTransactions function.');
            await this.transactionRepository.save(transaction);
            this.logger.log('Successfully updated transaction.');
        }
        catch (error) {
            this.logger.error(`[TransactionService] [createBulkTransactions] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async updateTransactionRelation(transactionDto) {
        try {
            this.logger.log('Starting updateTransactions function.');
            let vehicle = await this.vehicleService.findOne(transactionDto.vehicle);
            if (!vehicle) {
                throw new common_1.InternalServerErrorException('Vehicle Not Found');
            }
            const aggregatorData = await this.aggregatorService.findOneByName(transactionDto?.aggregator || 'idle');
            const { vehicleType, model, ownedBy, aggregator, ...vehicleData } = vehicle;
            if (transactionDto.action === 'out') {
                if (vehicle.status === 'occupied') {
                    throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.occupied(vehicle.id));
                }
                vehicle = await this.vehicleService.update(vehicle.id, { ...vehicleData, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregatorData.id || 1), status: 'occupied' });
            }
            else if (transactionDto.action === 'in') {
                if (vehicle.status === 'available') {
                    throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.available(vehicle.id));
                }
                vehicle = await this.vehicleService.update(vehicle.id, { ...vehicle, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregatorData.id || 1), status: 'available' });
            }
            const employee = await this.employeeService.findOne(transactionDto.employee);
            if (employee.status === 'inactive') {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.inactive(employee.id));
            }
            const location = await this.locationService.findOne(transactionDto.location);
            this.logger.log('Successfully updated transaction.');
            return { employee, location, vehicle };
        }
        catch (error) {
            this.logger.error(`[TransactionService] [updateTransactionRelation] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = TransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        vehicle_service_1.VehicleService,
        employee_service_1.EmployeeService,
        location_service_1.LocationService,
        aggregator_service_1.AggregatorService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map