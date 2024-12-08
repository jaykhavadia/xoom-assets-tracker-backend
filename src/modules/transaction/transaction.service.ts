import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/constants/messages.constants';
import { VehicleService } from '../vehicle/vehicle.service';
import { EmployeeService } from '../employee/employee.service';
import { LocationService } from '../location/location.service';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private readonly vehicleService: VehicleService,
        private readonly employeeService: EmployeeService,
        private readonly locationService: LocationService,
    ) { }

    /**
     * Creates a new transaction in the database.
     * @param transactionDto - The transaction data to create.
     * @returns The created transaction.
     */
    async create(transactionDto: CreateTransactionDto): Promise<Transaction> {
        try {
            // Find the related entities using their IDs
            let vehicle = await this.vehicleService.findOne(transactionDto.vehicle);
            const { vehicleType, model, ownedBy, aggregator, ...vehicleData } = vehicle;
            if (transactionDto.action === 'in') {
                if (vehicle.status === 'occupied') {
                    throw new InternalServerErrorException(Messages.vehicle.occupied(vehicle.id)); // Handle error
                }
                vehicle = await this.vehicleService.update(vehicle.id, { ...vehicleData, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregator.id), status: 'occupied' })
            } else if (transactionDto.action === 'out') {
                if (vehicle.status === 'available') {
                    throw new InternalServerErrorException(Messages.vehicle.available(vehicle.id)); // Handle error
                }
                vehicle = await this.vehicleService.update(vehicle.id, { ...vehicle, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregator.id), status: 'available' })
            }
            const employee = await this.employeeService.findOne(transactionDto.employee);
            if (employee.status === 'inactive') {
                throw new InternalServerErrorException(Messages.employee.inactive(employee.id)); // Handle error
            }
            const location = await this.locationService.findOne(transactionDto.location);
            // Create a new Transaction instance with the relevant properties
            let transaction = this.transactionRepository.create({
                date: transactionDto.date,
                time: transactionDto.time,
                comments: transactionDto.comments,
                vehicle,
                employee,
                location,
                pictures: [],
            });
            transaction = await this.transactionRepository.save(transaction); // Save the transaction
            return this.transactionRepository.findOne({
                where: { id: transaction.id },
                relations: ['vehicle', 'employee', 'location'], // Explicitly load relations
            });
        } catch (error) {
            this.logger.error(`[TransactionService] [create] Error: ${error.message}`); // Log error
            throw new InternalServerErrorException(error.message || Messages.transaction.createFailure); // Handle error
        }
    }

    /**
     * Updates an existing transaction in the database.
     * @param id - The ID of the transaction to update.
     * @param updateDto - The updated transaction data.
     * @returns The updated transaction.
     */
    async update(id: number, updateDto: any): Promise<Transaction> {
        try {
            await this.transactionRepository.update({ id }, updateDto); // Update the transaction
            return this.transactionRepository.findOne({
                where: { id },
                relations: ['vehicle', 'employee', 'location'], // Explicitly load relations
            }); // Fetch the updated transaction
        } catch (error) {
            this.logger.error(`[TransactionService] [update] Error: ${error.message}`); // Log error
            throw new InternalServerErrorException(Messages.transaction.updateFailure(id)); // Handle error
        }
    }

    /**
     * Finds a transaction by its ID.
     * @param id - The ID of the transaction to find.
     * @returns The found transaction.
     */
    async findOne(id: number): Promise<Transaction> {
        try {
            return this.transactionRepository.findOne({
                where: { id },
                relations: ['vehicle', 'employee', 'location'], // Explicitly load relations
            });
        } catch (error) {
            this.logger.error(`[TransactionService] [findOne] Error: ${error.message}`); // Log error
            throw new InternalServerErrorException(Messages.transaction.findOneFailure(id)); // Handle error
        }
    }

    /**
     * Finds all transactions in the database.
     * @returns An array of transactions.
     */
    async findAll(): Promise<Transaction[]> {
        try {
            return await this.transactionRepository.find({ relations: ['vehicle', 'employee', 'location'] }); // Fetch all transactions
        } catch (error) {
            this.logger.error(`[TransactionService] [findAll] Error: ${error.message}`); // Log error
            throw new InternalServerErrorException(Messages.transaction.findAllFailure); // Handle error
        }
    }

    /**
     * Removes a transaction by its ID.
     * @param id - The ID of the transaction to remove.
     */
    async remove(id: number): Promise<void> {
        try {
            await this.transactionRepository.delete(id); // Delete transaction by ID
        } catch (error) {
            this.logger.error(`[TransactionService] [remove] Error: ${error.message}`); // Log error
            throw new InternalServerErrorException(Messages.transaction.removeFailure(id)); // Handle error
        }
    }
}
