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
var EmployeeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../transaction/entities/transaction.entity");
let EmployeeService = EmployeeService_1 = class EmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.logger = new common_1.Logger(EmployeeService_1.name);
    }
    async create(employee) {
        try {
            return await this.employeeRepository.save(employee);
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [create] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException("Failed to create employee.");
        }
    }
    async findAll() {
        try {
            const employees = await this.employeeRepository.find({
                relations: ["transactions", "transactions.vehicle"],
                order: { transactions: { date: "DESC", time: "DESC" } },
            });
            return employees.map((employee) => {
                const latestTransaction = employee.transactions?.[0];
                return {
                    id: employee.id,
                    code: employee.code,
                    name: employee.name,
                    status: employee.status,
                    isDeleted: employee.isDeleted,
                    vehicle: latestTransaction?.action === transaction_entity_1.Action.OUT
                        ? latestTransaction.vehicle
                        : null,
                };
            });
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [findAll] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException("Failed to retrieve employees.");
        }
    }
    async findOne(id) {
        try {
            return await this.employeeRepository.findOneBy({ id });
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to find employee with id: ${id}`);
        }
    }
    async findByCode(code) {
        try {
            return await this.employeeRepository.findOneBy({ code });
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [findOne] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to find employee with code: ${code}`);
        }
    }
    async update(id, employee) {
        try {
            await this.employeeRepository.update(id, employee);
            return await this.findOne(id);
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [update] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to update employee with id: ${id}`);
        }
    }
    async remove(id) {
        try {
            let employee = await this.findOne(id);
            if (!employee) {
                throw new common_1.InternalServerErrorException(`No data with id: ${id}`);
            }
            await this.employeeRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [remove] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to delete employee with id: ${id}`);
        }
    }
    async updateEmployees(employees) {
        try {
            this.logger.log("Starting updateEmployees function.");
            await this.employeeRepository.save(employees);
            this.logger.log("Successfully updated employees.");
        }
        catch (error) {
            this.logger.error(`[EmployeeService] [updateEmployees] Error: ${error.message}`);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = EmployeeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map