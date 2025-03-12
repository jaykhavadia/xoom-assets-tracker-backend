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
const CreateTransaction_dto_1 = require("./dto/CreateTransaction.dto");
const date_fns_1 = require("date-fns");
const aggregator_service_1 = require("../aggregator/aggregator.service");
const moment = require("moment");
const XLSX = require("xlsx");
const upload_service_1 = require("../../common/upload/upload.service");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(transactionRepository, vehicleService, employeeService, locationService, aggregatorService, uploadService) {
        this.transactionRepository = transactionRepository;
        this.vehicleService = vehicleService;
        this.employeeService = employeeService;
        this.locationService = locationService;
        this.aggregatorService = aggregatorService;
        this.uploadService = uploadService;
        this.logger = new common_1.Logger(TransactionService_1.name);
        this.getCurrentDateTime = () => {
            const now = moment();
            const date = now.format("YYYY-MM-DD");
            const time = now.format("HH:mm:ss");
            return { date, time };
        };
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
            if (period.toLowerCase() === "am" && hours === 12) {
                hours = 0;
            }
            else if (period.toLowerCase() === "pm" && hours !== 12) {
                hours += 12;
            }
            const formattedHour = hours.toString().padStart(2, "0");
            const formattedMinute = minutes.padStart(2, "0");
            const formattedSeconds = seconds.padStart(2, "0");
            return `${formattedHour}:${formattedMinute}:${formattedSeconds}`;
        };
    }
    async create(transactionDto) {
        try {
            const { employee, location, vehicle, aggregator } = await this.updateTransactionRelation(transactionDto);
            let transaction = this.transactionRepository.create({
                date: transactionDto.date,
                time: this.convertTo24HourFormat(transactionDto.time),
                comments: transactionDto.comments,
                action: transactionDto.action,
                vehicle,
                employee,
                location,
                user: transactionDto.user,
                aggregator: aggregator.name,
                pictures: [],
            });
            transaction = await this.transactionRepository.save(transaction);
            return await this.transactionRepository.findOne({
                where: { id: transaction.id },
                relations: ["vehicle", "employee", "location", "user"],
            });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [create] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message || messages_constants_1.Messages.transaction.createFailure);
        }
    }
    async update(id, updateDto) {
        try {
            const { comments, date, employee, location, time, user } = updateDto;
            const transaction = await this.findOne(id);
            let vehicle = await this.vehicleService.findOne(transaction.vehicle.id);
            const employeeData = await this.employeeService.findOne(updateDto.employee);
            if (employeeData.status === "inactive") {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.inactive(employeeData.id));
            }
            const { data: employeeLastTransaction } = await this.getEmployeeLatestTransaction(employeeData.id);
            if (updateDto.action === "out" &&
                employeeLastTransaction &&
                employeeLastTransaction.action === transaction_entity_1.Action.OUT) {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.isOccupied(employeeData.id, employeeLastTransaction.vehicle.vehicleNo));
            }
            if (updateDto.action === "in" &&
                employeeLastTransaction &&
                employeeLastTransaction.action === transaction_entity_1.Action.IN) {
                throw new common_1.InternalServerErrorException("Employee is already available cant check in");
            }
            if (updateDto.action === "in" &&
                employeeLastTransaction &&
                employeeLastTransaction.action === transaction_entity_1.Action.IN &&
                employeeLastTransaction.vehicle.vehicleNo !== vehicle.vehicleNo) {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.differentVehicle(employeeData.id, employeeLastTransaction.vehicle.vehicleNo));
            }
            const aggregatorData = await this.aggregatorService.findOneByName(updateDto?.aggregator || "idle");
            const { vehicleType, model, ownedBy, aggregator, isActive, ...vehicleData } = vehicle;
            if (!isActive) {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.notActive(vehicleData.id));
            }
            const locationData = await this.locationService.findOne(location);
            vehicle = await this.vehicleService.update(vehicle.id, {
                ...vehicleData,
                isActive,
                vehicleTypeId: Number(vehicleType.id),
                modelId: Number(model.id),
                ownedById: Number(ownedBy.id),
                aggregatorId: Number(aggregatorData.id || 1),
                status: "occupied",
                location: locationData.name,
            });
            await this.transactionRepository.update({ id }, {
                comments,
                date,
                employee: employeeData,
                location: locationData,
                time,
                user,
            });
            return this.transactionRepository.findOne({
                where: { id },
                relations: ["vehicle", "employee", "location", "user"],
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
                relations: ["vehicle", "employee", "location", "user"],
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
                relations: ["vehicle", "employee", "location", "user"],
            });
        }
        catch (error) {
            this.logger.error(`[TransactionService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(messages_constants_1.Messages.transaction.findOneFailure(id));
        }
    }
    async findAll() {
        try {
            return await this.transactionRepository.find({
                relations: ["vehicle", "employee", "location", "user"],
            });
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
    async findPastTransaction(vehicleNo, action) {
        try {
            const { time, date } = this.getCurrentDateTime();
            const queryBuilder = this.transactionRepository
                .createQueryBuilder("t")
                .innerJoinAndSelect("t.vehicle", "v", "v.vehicleNo = :vehicleNo", {
                vehicleNo,
            })
                .leftJoinAndSelect("t.employee", "employee")
                .leftJoinAndSelect("t.location", "location")
                .addSelect("location.name", "locationName")
                .where("(t.date < :date OR (t.date = :date AND t.time <= :time))", {
                date,
                time,
            })
                .orderBy("t.date", "DESC")
                .addOrderBy("t.time", "DESC")
                .limit(1);
            let result = await queryBuilder.getOne();
            if (result?.action === "in" && action === "in") {
                throw new Error("Vehicle already Checked IN");
            }
            else if (result?.action === "out" && action === "out") {
                throw new Error("Vehicle already Checked OUT");
            }
            return result;
        }
        catch (error) {
            this.logger.error(`[TransactionService] [findPastTransaction] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getTransactionsByDateRange(from, to, months, date) {
        const queryBuilder = this.transactionRepository
            .createQueryBuilder("transaction")
            .leftJoinAndSelect("transaction.vehicle", "vehicle")
            .leftJoinAndSelect("transaction.employee", "employee")
            .leftJoinAndSelect("transaction.location", "location");
        if (date) {
            queryBuilder.andWhere("transaction.date = :date", { date });
        }
        if (from && to) {
            queryBuilder.andWhere("transaction.date BETWEEN :from AND :to", {
                from,
                to,
            });
        }
        if (months && months > 0) {
            const startDate = (0, date_fns_1.format)((0, date_fns_1.subMonths)(new Date(), months), "yyyy-MM-dd");
            const endDate = (0, date_fns_1.format)(new Date(), "yyyy-MM-dd");
            queryBuilder.andWhere("transaction.date BETWEEN :startDate AND :endDate", { startDate, endDate });
        }
        if (!from && !to && !months) {
            const currentMonthStart = (0, date_fns_1.format)((0, date_fns_1.startOfMonth)(new Date()), "yyyy-MM-dd");
            const currentMonthEnd = (0, date_fns_1.format)((0, date_fns_1.endOfMonth)(new Date()), "yyyy-MM-dd");
            queryBuilder.andWhere("transaction.date BETWEEN :currentMonthStart AND :currentMonthEnd", {
                currentMonthStart,
                currentMonthEnd,
            });
        }
        queryBuilder
            .orderBy("transaction.date", "DESC")
            .addOrderBy("transaction.time", "DESC");
        const transactions = await queryBuilder.getMany();
        if (!transactions.length) {
            throw new Error("No transactions found for the given filters.");
        }
        return transactions;
    }
    async createBulkTransactions(transaction) {
        try {
            this.logger.log("Starting updateTransactions function.");
            await this.transactionRepository.save(transaction);
            this.logger.log("Successfully updated transaction.");
        }
        catch (error) {
            this.logger.error(`[TransactionService] [createBulkTransactions] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async updateTransactionRelation(transactionDto) {
        try {
            let vehicle = await this.vehicleService.findOne(transactionDto.vehicle);
            if (!vehicle) {
                throw new common_1.InternalServerErrorException("Vehicle Not Found");
            }
            const employee = await this.employeeService.findOne(transactionDto.employee);
            if (!employee) {
                throw new common_1.InternalServerErrorException("Employee Not Found");
            }
            if (employee.status === "inactive") {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.inactive(employee.id));
            }
            const { data: employeeLastTransaction } = await this.getEmployeeLatestTransaction(employee.id);
            if (transactionDto.action === "out" &&
                employeeLastTransaction &&
                employeeLastTransaction.action === transaction_entity_1.Action.OUT) {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.isOccupied(employee.id, employeeLastTransaction.vehicle.vehicleNo));
            }
            if (transactionDto.action === "in" &&
                employeeLastTransaction &&
                employeeLastTransaction.action === transaction_entity_1.Action.IN) {
                throw new common_1.InternalServerErrorException("Employee is already available cant check in");
            }
            if (transactionDto.action === "in" &&
                employeeLastTransaction &&
                employeeLastTransaction.action === transaction_entity_1.Action.IN &&
                employeeLastTransaction.vehicle.vehicleNo !== vehicle.vehicleNo) {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.employee.differentVehicle(employee.id, employeeLastTransaction.vehicle.vehicleNo));
            }
            const aggregatorData = await this.aggregatorService.findOneByName(transactionDto.action === "out" ? transactionDto?.aggregator : "idle");
            const { vehicleType, model, ownedBy, aggregator, isActive, ...vehicleData } = vehicle;
            if (!isActive) {
                throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.notActive(vehicleData.id));
            }
            const location = await this.locationService.findOne(transactionDto.location);
            if (transactionDto.action === "out") {
                if (vehicle.status === "occupied") {
                    throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.occupied(vehicle.id));
                }
                vehicle = await this.vehicleService.update(vehicle.id, {
                    ...vehicleData,
                    isActive,
                    vehicleTypeId: Number(vehicleType.id),
                    modelId: Number(model.id),
                    ownedById: Number(ownedBy.id),
                    aggregatorId: Number(aggregatorData.id),
                    status: "occupied",
                    location: location.name,
                });
            }
            else if (transactionDto.action === "in") {
                if (vehicle.status === "available") {
                    throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.available(vehicle.id));
                }
                vehicle = await this.vehicleService.update(vehicle.id, {
                    ...vehicleData,
                    isActive,
                    vehicleTypeId: Number(vehicleType.id),
                    modelId: Number(model.id),
                    ownedById: Number(ownedBy.id),
                    aggregatorId: Number(aggregatorData.id),
                    status: "available",
                    location: location.name,
                });
            }
            this.logger.log("Successfully updated transaction.");
            return { employee, location, vehicle, aggregator: aggregatorData };
        }
        catch (error) {
            this.logger.error(`[TransactionService] [updateTransactionRelation] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async processTransaction(file, type) {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if (Object.keys(jsonData[0]).includes("Vehicle No.") &&
            type !== "transaction") {
            throw new Error("INVALID_FILE");
        }
        const errorArray = [];
        const transactions = [];
        for (const [index, item] of jsonData.entries()) {
            try {
                const transaction = new CreateTransaction_dto_1.CreateTransactionDto();
                if (item["Status"] === "Check Out" || item["Status"] === "Check In") {
                    transaction.action =
                        item["Status"] === "Check Out" ? transaction_entity_1.Action.OUT : transaction_entity_1.Action.IN;
                }
                else {
                    errorArray.push(`Incorrect Status Format at ${index + 1}. Expected Check Out OR Check In`);
                    continue;
                }
                if (this.uploadService.validateTime(item["Cut Off Time"]) &&
                    !item["Cut Off Time"].includes("'") &&
                    (item["Cut Off Time"].includes("AM") ||
                        item["Cut Off Time"].includes("PM"))) {
                    this.logger.log("The string contains AM or PM", index);
                }
                else {
                    errorArray.push(`Incorrect Time Format at Data No. ${index + 1}. Expected HH:MM:SS AM/PM, got ${item["Cut Off Time"]}`);
                    continue;
                }
                transaction.time = item["Cut Off Time"];
                transaction.date = this.uploadService.excelDateToJSDate(item["Cut Off Date"]);
                const vehicleMatch = await this.vehicleService.findByVehicleNo(item["Vehicle No."].toString());
                if (vehicleMatch) {
                    const employeeMatch = await this.employeeService.findByCode(item["XDS No."]);
                    if (employeeMatch) {
                        if (employeeMatch.status === "inactive") {
                            errorArray.push(`${messages_constants_1.Messages.employee.inactive(item["XDS No."])} at Data No. ${index + 1}`);
                            continue;
                        }
                        const { data: employeeLastTransaction } = await this.getEmployeeLatestTransaction(employeeMatch.id);
                        if (transaction.action === "out" &&
                            employeeLastTransaction &&
                            employeeLastTransaction.action === transaction_entity_1.Action.OUT) {
                            errorArray.push(messages_constants_1.Messages.employee.isOccupied(employeeMatch.id, employeeLastTransaction.vehicle.vehicleNo));
                            continue;
                        }
                        if (transaction.action === "in" &&
                            employeeLastTransaction &&
                            employeeLastTransaction.action === transaction_entity_1.Action.IN) {
                            errorArray.push("Employee is already available cant check in");
                            continue;
                        }
                        if (transaction.action === "in" &&
                            employeeLastTransaction &&
                            employeeLastTransaction.action === transaction_entity_1.Action.IN &&
                            employeeLastTransaction.vehicle.vehicleNo !==
                                vehicleMatch.vehicleNo) {
                            errorArray.push(messages_constants_1.Messages.employee.differentVehicle(employeeMatch.id, employeeLastTransaction.vehicle.vehicleNo));
                            continue;
                        }
                        transaction.employee = employeeMatch.id;
                    }
                    else {
                        errorArray.push(`Employee with XDS No. ${item["XDS No."]} not found at Data No. ${index + 1}`);
                        continue;
                    }
                    if (!vehicleMatch.isActive) {
                        throw new common_1.InternalServerErrorException(messages_constants_1.Messages.vehicle.notActive(vehicleMatch.id));
                    }
                    if (transaction.action === transaction_entity_1.Action.OUT) {
                        if (vehicleMatch.status === "occupied") {
                            errorArray.push(`${messages_constants_1.Messages.vehicle.occupied(item["Vehicle No."])} at Data No. ${index + 1}`);
                            continue;
                        }
                        transaction.vehicle = vehicleMatch.id;
                    }
                    else if (transaction.action === transaction_entity_1.Action.IN) {
                        if (vehicleMatch.status === "available") {
                            errorArray.push(`${messages_constants_1.Messages.vehicle.available(item["Vehicle No."])} at Data No. ${index + 1}`);
                            continue;
                        }
                        transaction.vehicle = vehicleMatch.id;
                    }
                }
                else {
                    errorArray.push(`Vehicle with number ${item["Vehicle No."]} not found at Data No. ${index + 1}`);
                    continue;
                }
                const aggregatorMatch = await this.aggregatorService.findOneByName(item["Aggregator"]);
                if (aggregatorMatch) {
                    transaction.aggregator = aggregatorMatch.name;
                }
                else {
                    errorArray.push(`Aggregator ${item["Aggregator"]} not found at Data No. ${index + 1}`);
                    continue;
                }
                const locationMatch = await this.locationService.findByName(item["Location"]);
                if (locationMatch) {
                    transaction.location = locationMatch.id;
                }
                else {
                    errorArray.push(`Location with name ${item["Location"]} not found at Data No. ${index + 1}`);
                    continue;
                }
                transaction.comments = "";
                const savedTransaction = await this.create(transaction);
                transactions.push(savedTransaction);
            }
            catch (error) {
                errorArray.push(`Error processing item at Data No. ${index + 1}: ${error.message}`);
            }
        }
        return errorArray;
    }
    async getEmployeeLatestTransaction(employeeId) {
        try {
            const latestTransaction = await this.transactionRepository.findOne({
                where: { employee: { id: employeeId } },
                order: { createdAt: "DESC" },
                relations: ["vehicle", "employee", "location", "user"],
            });
            if (!latestTransaction) {
                return {
                    success: false,
                    message: "No transaction found for the given employee.",
                    data: null,
                };
            }
            return {
                success: true,
                message: "Latest transaction retrieved successfully.",
                data: latestTransaction,
            };
        }
        catch (error) {
            this.logger.error(`[TransactionService] [getLatestTransaction] Error: ${error.message}`);
            throw new common_1.HttpException("Failed to retrieve the latest transaction.", common_1.HttpStatus.BAD_REQUEST);
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
        aggregator_service_1.AggregatorService,
        upload_service_1.UploadService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map