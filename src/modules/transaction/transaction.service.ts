import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/constants/messages.constants';
import { VehicleService } from '../vehicle/vehicle.service';
import { EmployeeService } from '../employee/employee.service';
import { LocationService } from '../location/location.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/CreateTransaction.dto';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'; // Install date-fns for date manipulation
import { AggregatorService } from '../aggregator/aggregator.service';
import { Employee } from '../employee/entities/employee.entity';
import { Location } from '../location/entities/location.entity';
import { Vehicle } from '../vehicle/entities/vehical.entity';

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private readonly vehicleService: VehicleService,
        private readonly employeeService: EmployeeService,
        private readonly locationService: LocationService,
        private readonly aggregatorService: AggregatorService,
    ) { }

    /**
     * Creates a new transaction in the database.
     * @param transactionDto - The transaction data to create.
     * @returns The created transaction.
     */
    async create(transactionDto: CreateTransactionDto): Promise<Transaction> {
        try {
            const { employee, location, vehicle } = await this.updateTransactionRelation(transactionDto);

            // Create a new Transaction instance with the relevant properties
            let transaction = this.transactionRepository.create({
                date: transactionDto.date,
                time: this.convertTo24HourFormat(transactionDto.time), // Date Formate
                comments: transactionDto.comments,
                action: transactionDto.action,
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
    async update(id: number, updateDto: UpdateTransactionDto): Promise<Transaction> {
        try {
            const { comments, date, employee, location, time } = updateDto;
            const transaction = await this.findOne(id);

            let vehicle = await this.vehicleService.findOne(transaction.vehicle.id);

            const aggregatorData = await this.aggregatorService.findOneByName(updateDto?.aggregator || 'idle');
            const { vehicleType, model, ownedBy, aggregator, ...vehicleData } = vehicle;

            vehicle = await this.vehicleService.update(vehicle.id, { ...vehicleData, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregatorData.id || 1), status: 'occupied' })

            const employeeData = await this.employeeService.findOne(updateDto.employee);
            if (employeeData.status === 'inactive') {
                throw new InternalServerErrorException(Messages.employee.inactive(employeeData.id)); // Handle error
            }
            const locationData = await this.locationService.findOne(updateDto.location);

            await this.transactionRepository.update({ id },
                {
                    comments,
                    date, employee: employeeData, location: locationData, time
                }
            ); // Update the transaction
            return this.transactionRepository.findOne({
                where: { id },
                relations: ['vehicle', 'employee', 'location'], // Explicitly load relations
            }); // Fetch the updated transaction
        } catch (error) {
            this.logger.error(`[TransactionService] [update] Error: ${error.message}`); // Log error
            throw new InternalServerErrorException(Messages.transaction.updateFailure(id)); // Handle error
        }
    }

    async updateTransaction(id: number, updateDto: any): Promise<Transaction> {
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

    async getTransactionsByDateRange(
        from?: string,
        to?: string,
        months?: number,
        date?: string
    ): Promise<Transaction[]> {
        const queryBuilder = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.vehicle', 'vehicle')
            .leftJoinAndSelect('transaction.employee', 'employee')
            .leftJoinAndSelect('transaction.location', 'location');

        // Filter by specific date
        if (date) {
            queryBuilder.andWhere('transaction.date = :date', { date });
        }

        // Filter by date range
        if (from && to) {
            queryBuilder.andWhere('transaction.date BETWEEN :from AND :to', { from, to });
        }

        // Filter by past months
        if (months && months > 0) {
            const startDate = format(subMonths(new Date(), months), 'yyyy-MM-dd'); // Calculate past months
            const endDate = format(new Date(), 'yyyy-MM-dd'); // Today
            queryBuilder.andWhere('transaction.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }

        // Filter by current month (if no specific date range or months are provided)
        if (!from && !to && !months) {
            const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
            const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
            queryBuilder.andWhere('transaction.date BETWEEN :currentMonthStart AND :currentMonthEnd', {
                currentMonthStart,
                currentMonthEnd,
            });
        }

        // Order by date and time
        queryBuilder.orderBy('transaction.date', 'DESC').addOrderBy('transaction.time', 'DESC');

        const transactions = await queryBuilder.getMany();

        if (!transactions.length) {
            throw new Error('No transactions found for the given filters.');
        }

        return transactions;
    }

    /**
        * Clears the Transaction table and inserts new transaction data
        * @param transaction - array of new transaction to be inserted
        */
    async createBulkTransactions(transaction: Transaction[]): Promise<void> {
        try {
            this.logger.log('Starting updateTransactions function.');
            // Insert the new employee data
            await this.transactionRepository.save(transaction);

            this.logger.log('Successfully updated transaction.');
        } catch (error) {
            this.logger.error(`[TransactionService] [createBulkTransactions] Error: ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }
    async updateTransactionRelation(transactionDto: CreateTransactionDto): Promise<{ employee: Employee, location: Location, vehicle: Vehicle }> {
        try {
            this.logger.log('Starting updateTransactions function.');
            // Find the related entities using their IDs
            let vehicle = await this.vehicleService.findOne(transactionDto.vehicle);
            if (!vehicle) {
                throw new InternalServerErrorException('Vehicle Not Found'); // Handle error
            }
            const aggregatorData = await this.aggregatorService.findOneByName(transactionDto?.aggregator || 'idle');
            const { vehicleType, model, ownedBy, aggregator, ...vehicleData } = vehicle;
            if (transactionDto.action === 'out') {
                if (vehicle.status === 'occupied') {
                    throw new InternalServerErrorException(Messages.vehicle.occupied(vehicle.id)); // Handle error
                }
                vehicle = await this.vehicleService.update(vehicle.id, { ...vehicleData, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregatorData.id || 1), status: 'occupied' })
            } else if (transactionDto.action === 'in') {
                if (vehicle.status === 'available') {
                    throw new InternalServerErrorException(Messages.vehicle.available(vehicle.id)); // Handle error
                }
                vehicle = await this.vehicleService.update(vehicle.id, { ...vehicle, vehicleTypeId: Number(vehicleType.id), modelId: Number(model.id), ownedById: Number(ownedBy.id), aggregatorId: Number(aggregatorData.id || 1), status: 'available' })
            }
            const employee = await this.employeeService.findOne(transactionDto.employee);
            if (employee.status === 'inactive') {
                throw new InternalServerErrorException(Messages.employee.inactive(employee.id)); // Handle error
            }
            const location = await this.locationService.findOne(transactionDto.location);

            this.logger.log('Successfully updated transaction.');
            return { employee, location, vehicle };
        } catch (error) {
            this.logger.error(`[TransactionService] [updateTransactionRelation] Error: ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    convertTo24HourFormat = (time: string): string => {
        const [hour, minute, period] = time.split(/[:\s]/);
        let hours = parseInt(hour, 10);
        let minutes = minute;
        let seconds = "00";

        if (period.toLowerCase() === 'am' && hours === 12) {
            hours = 0; // Midnight case: 12 AM is 00:00
        } else if (period.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12; // PM case: Add 12 for afternoon/evening
        }

        // Format hours and minutes with leading zeros if necessary
        const formattedHour = hours.toString().padStart(2, '0');
        const formattedMinute = minutes.padStart(2, '0');

        return `${formattedHour}:${formattedMinute}:${seconds}`;
    }

}
