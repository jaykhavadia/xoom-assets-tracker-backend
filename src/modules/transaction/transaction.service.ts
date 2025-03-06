import { Aggregator } from "src/modules/aggregator/entities/aggregator.entity";
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Action, Transaction } from "./entities/transaction.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Messages } from "src/constants/messages.constants";
import { VehicleService } from "../vehicle/vehicle.service";
import { EmployeeService } from "../employee/employee.service";
import { LocationService } from "../location/location.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "./dto/CreateTransaction.dto";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns"; // Install date-fns for date manipulation
import { AggregatorService } from "../aggregator/aggregator.service";
import { Employee } from "../employee/entities/employee.entity";
import { Location } from "../location/entities/location.entity";
import { Vehicle } from "../vehicle/entities/vehical.entity";
import * as moment from "moment";
import * as XLSX from "xlsx";
import { UploadService } from "../../common/upload/upload.service";

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
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Creates a new transaction in the database.
   * @param transactionDto - The transaction data to create.
   * @returns The created transaction.
   */
  async create(transactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      const { employee, location, vehicle, aggregator } =
        await this.updateTransactionRelation(transactionDto);

      // Create a new Transaction instance with the relevant properties
      let transaction = this.transactionRepository.create({
        date: transactionDto.date,
        time: this.convertTo24HourFormat(transactionDto.time), // Date Formate
        comments: transactionDto.comments,
        action: transactionDto.action,
        vehicle,
        employee,
        location,
        user: transactionDto.user,
        aggregator: aggregator.name,
        pictures: [],
      });
      transaction = await this.transactionRepository.save(transaction); // Save the transaction
      return await this.transactionRepository.findOne({
        where: { id: transaction.id },
        relations: ["vehicle", "employee", "location", "user"], // Explicitly load relations
      });
    } catch (error) {
      this.logger.error(
        `[TransactionService] [create] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(
        error.message || Messages.transaction.createFailure,
      ); // Handle error
    }
  }

  /**
   * Updates an existing transaction in the database.
   * @param id - The ID of the transaction to update.
   * @param updateDto - The updated transaction data.
   * @returns The updated transaction.
   */
  async update(
    id: number,
    updateDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    try {
      const { comments, date, employee, location, time, user } = updateDto;
      const transaction = await this.findOne(id);

      let vehicle = await this.vehicleService.findOne(transaction.vehicle.id);

      const aggregatorData = await this.aggregatorService.findOneByName(
        updateDto?.aggregator || "idle",
      );
      const {
        vehicleType,
        model,
        ownedBy,
        aggregator,
        isActive,
        ...vehicleData
      } = vehicle;

      if (!isActive) {
        throw new InternalServerErrorException(
          Messages.vehicle.notActive(vehicleData.id),
        ); // Handle error
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

      const employeeData = await this.employeeService.findOne(
        updateDto.employee,
      );
      if (employeeData.status === "inactive") {
        throw new InternalServerErrorException(
          Messages.employee.inactive(employeeData.id),
        ); // Handle error
      }
      const { data: employeeLastTransaction } =
        await this.getEmployeeLatestTransaction(employeeData.id);
      if (
        updateDto.action === "out" &&
        employeeLastTransaction &&
        employeeLastTransaction.action === Action.OUT
      ) {
        throw new InternalServerErrorException(
          Messages.employee.isOccupied(
            employeeData.id,
            employeeLastTransaction.vehicle.vehicleNo,
          ),
        ); // Handle error
      }
      if (
        updateDto.action === "in" &&
        employeeLastTransaction &&
        employeeLastTransaction.action === Action.IN
      ) {
        throw new InternalServerErrorException(
          "Employee is already available cant check in",
        ); // Handle error
      }
      if (
        updateDto.action === "in" &&
        employeeLastTransaction &&
        employeeLastTransaction.action === Action.IN &&
        employeeLastTransaction.vehicle.vehicleNo !== vehicle.vehicleNo
      ) {
        throw new InternalServerErrorException(
          Messages.employee.differentVehicle(
            employeeData.id,
            employeeLastTransaction.vehicle.vehicleNo,
          ),
        ); // Handle error
      }

      await this.transactionRepository.update(
        { id },
        {
          comments,
          date,
          employee: employeeData,
          location: locationData,
          time,
          user,
        },
      ); // Update the transaction
      return this.transactionRepository.findOne({
        where: { id },
        relations: ["vehicle", "employee", "location", "user"], // Explicitly load relations
      }); // Fetch the updated transaction
    } catch (error) {
      this.logger.error(
        `[TransactionService] [update] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(
        Messages.transaction.updateFailure(id),
      ); // Handle error
    }
  }

  async updateTransaction(id: number, updateDto: any): Promise<Transaction> {
    try {
      await this.transactionRepository.update({ id }, updateDto); // Update the transaction
      return this.transactionRepository.findOne({
        where: { id },
        relations: ["vehicle", "employee", "location", "user"], // Explicitly load relations
      }); // Fetch the updated transaction
    } catch (error) {
      this.logger.error(
        `[TransactionService] [update] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(
        Messages.transaction.updateFailure(id),
      ); // Handle error
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
        relations: ["vehicle", "employee", "location", "user"], // Explicitly load relations
      });
    } catch (error) {
      this.logger.error(
        `[TransactionService] [findOne] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(
        Messages.transaction.findOneFailure(id),
      ); // Handle error
    }
  }

  /**
   * Finds all transactions in the database.
   * @returns An array of transactions.
   */
  async findAll(): Promise<Transaction[]> {
    try {
      return await this.transactionRepository.find({
        relations: ["vehicle", "employee", "location", "user"],
      }); // Fetch all transactions
    } catch (error) {
      this.logger.error(
        `[TransactionService] [findAll] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(
        Messages.transaction.findAllFailure,
      ); // Handle error
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
      this.logger.error(
        `[TransactionService] [remove] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(
        Messages.transaction.removeFailure(id),
      ); // Handle error
    }
  }

  async findPastTransaction(
    vehicleNo: number,
    action: Action,
  ): Promise<Transaction> {
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
        .addOrderBy("t.time", "DESC") // Ensure secondary ordering by time
        .limit(1);

      let result = await queryBuilder.getOne();

      if (result?.action === "in" && action === "in") {
        throw new Error("Vehicle already Checked IN");
      } else if (result?.action === "out" && action === "out") {
        throw new Error("Vehicle already Checked OUT");
      }

      return result;
    } catch (error) {
      this.logger.error(
        `[TransactionService] [findPastTransaction] Error: ${error.message}`,
      ); // Log error
      throw new InternalServerErrorException(error.message); // Handle error
    }
  }

  getCurrentDateTime = () => {
    const now = moment();

    // Format date as dd-mm-yyyy
    const date = now.format("YYYY-MM-DD");

    // Format time as HH:mm:ss (24-hour format)
    const time = now.format("HH:mm:ss");

    return { date, time };
  };

  async getTransactionsByDateRange(
    from?: string,
    to?: string,
    months?: number,
    date?: string,
  ): Promise<Transaction[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.vehicle", "vehicle")
      .leftJoinAndSelect("transaction.employee", "employee")
      .leftJoinAndSelect("transaction.location", "location");

    // Filter by specific date
    if (date) {
      queryBuilder.andWhere("transaction.date = :date", { date });
    }

    // Filter by date range
    if (from && to) {
      queryBuilder.andWhere("transaction.date BETWEEN :from AND :to", {
        from,
        to,
      });
    }

    // Filter by past months
    if (months && months > 0) {
      const startDate = format(subMonths(new Date(), months), "yyyy-MM-dd"); // Calculate past months
      const endDate = format(new Date(), "yyyy-MM-dd"); // Today
      queryBuilder.andWhere(
        "transaction.date BETWEEN :startDate AND :endDate",
        { startDate, endDate },
      );
    }

    // Filter by current month (if no specific date range or months are provided)
    if (!from && !to && !months) {
      const currentMonthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
      const currentMonthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");
      queryBuilder.andWhere(
        "transaction.date BETWEEN :currentMonthStart AND :currentMonthEnd",
        {
          currentMonthStart,
          currentMonthEnd,
        },
      );
    }

    // Order by date and time
    queryBuilder
      .orderBy("transaction.date", "DESC")
      .addOrderBy("transaction.time", "DESC");

    const transactions = await queryBuilder.getMany();

    if (!transactions.length) {
      throw new Error("No transactions found for the given filters.");
    }

    return transactions;
  }

  /**
   * Clears the Transaction table and inserts new transaction data
   * @param transaction - array of new transaction to be inserted
   */
  async createBulkTransactions(transaction: Transaction[]): Promise<void> {
    try {
      this.logger.log("Starting updateTransactions function.");
      // Insert the new employee data
      await this.transactionRepository.save(transaction);

      this.logger.log("Successfully updated transaction.");
    } catch (error) {
      this.logger.error(
        `[TransactionService] [createBulkTransactions] Error: ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateTransactionRelation(
    transactionDto: CreateTransactionDto,
  ): Promise<{
    employee: Employee;
    location: Location;
    vehicle: Vehicle;
    aggregator: Aggregator;
  }> {
    try {
      // Find the related entities using their IDs
      let vehicle = await this.vehicleService.findOne(transactionDto.vehicle);
      if (!vehicle) {
        throw new InternalServerErrorException("Vehicle Not Found"); // Handle error
      }
      const aggregatorData: Aggregator =
        await this.aggregatorService.findOneByName(
          transactionDto.action === "out" ? transactionDto?.aggregator : "idle",
        );
      const {
        vehicleType,
        model,
        ownedBy,
        aggregator,
        isActive,
        ...vehicleData
      } = vehicle;

      if (!isActive) {
        throw new InternalServerErrorException(
          Messages.vehicle.notActive(vehicleData.id),
        ); // Handle error
      }

      const location = await this.locationService.findOne(
        transactionDto.location,
      );
      if (transactionDto.action === "out") {
        if (vehicle.status === "occupied") {
          throw new InternalServerErrorException(
            Messages.vehicle.occupied(vehicle.id),
          ); // Handle error
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
      } else if (transactionDto.action === "in") {
        if (vehicle.status === "available") {
          throw new InternalServerErrorException(
            Messages.vehicle.available(vehicle.id),
          ); // Handle error
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
      const employee = await this.employeeService.findOne(
        transactionDto.employee,
      );
      if (employee.status === "inactive") {
        throw new InternalServerErrorException(
          Messages.employee.inactive(employee.id),
        ); // Handle error
      }
      const { data: employeeLastTransaction } =
        await this.getEmployeeLatestTransaction(employee.id);

      if (
        transactionDto.action === "out" &&
        employeeLastTransaction &&
        employeeLastTransaction.action === Action.OUT
      ) {
        throw new InternalServerErrorException(
          Messages.employee.isOccupied(
            employee.id,
            employeeLastTransaction.vehicle.vehicleNo,
          ),
        ); // Handle error
      }
      if (
        transactionDto.action === "in" &&
        employeeLastTransaction &&
        employeeLastTransaction.action === Action.IN
      ) {
        throw new InternalServerErrorException(
          "Employee is already available cant check in",
        ); // Handle error
      }
      if (
        transactionDto.action === "in" &&
        employeeLastTransaction &&
        employeeLastTransaction.action === Action.IN &&
        employeeLastTransaction.vehicle.vehicleNo !== vehicle.vehicleNo
      ) {
        throw new InternalServerErrorException(
          Messages.employee.differentVehicle(
            employee.id,
            employeeLastTransaction.vehicle.vehicleNo,
          ),
        ); // Handle error
      }

      this.logger.log("Successfully updated transaction.");
      return { employee, location, vehicle, aggregator: aggregatorData };
    } catch (error) {
      this.logger.error(
        `[TransactionService] [updateTransactionRelation] Error: ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  convertTo24HourFormat = (time: string): string => {
    // Check if the time format is hh:mm:ss AM/PM or hh:mm AM/PM
    const timeArray = time.split(/[:\s]/);

    // Parse hour and minute
    let hours: number = parseInt(timeArray[0], 10);
    let minutes: string = timeArray[1],
      seconds: string,
      period: string;
    if (timeArray.length === 3) {
      seconds = "00";
      period = timeArray[2];
    } else {
      seconds = timeArray[2];
      period = timeArray[3];
    }

    // Adjust hours based on AM/PM
    if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0; // Midnight case: 12 AM is 00:00
    } else if (period.toLowerCase() === "pm" && hours !== 12) {
      hours += 12; // PM case: Add 12 for afternoon/evening
    }

    // Format hours, minutes, and seconds with leading zeros if necessary
    const formattedHour = hours.toString().padStart(2, "0");
    const formattedMinute = minutes.padStart(2, "0");
    const formattedSeconds = seconds.padStart(2, "0");

    return `${formattedHour}:${formattedMinute}:${formattedSeconds}`;
  };

  async processTransaction(
    file: Express.Multer.File,
    type: string,
  ): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet name
    const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
    const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON

    if (
      Object.keys(jsonData[0]).includes("Vehicle No.") &&
      type !== "transaction"
    ) {
      throw new Error("INVALID_FILE");
    }
    const errorArray = [];

    const transactions = [];

    for (const [index, item] of jsonData.entries()) {
      try {
        // Initialize a new transaction entity
        const transaction = new CreateTransactionDto();

        if (item["Status"] === "Check Out" || item["Status"] === "Check In") {
          // Set the action as "Check Out" or other enums as necessary
          transaction.action =
            item["Status"] === "Check Out" ? Action.OUT : Action.IN;
        } else {
          errorArray.push(
            `Incorrect Status Format at ${index + 1}. Expected Check Out OR Check In`,
          );
          continue; // Skip to the next iteration
        }

        // Parse the date and time
        if (
          this.uploadService.validateTime(item["Cut Off Time"]) &&
          !item["Cut Off Time"].includes("'") &&
          (item["Cut Off Time"].includes("AM") ||
            item["Cut Off Time"].includes("PM"))
        ) {
          this.logger.log("The string contains AM or PM", index);
        } else {
          errorArray.push(
            `Incorrect Time Format at Data No. ${index + 1}. Expected HH:MM:SS AM/PM, got ${item["Cut Off Time"]}`,
          );
          continue; // Skip to the next iteration
        }

        transaction.time = item["Cut Off Time"]; // Format as HH:mm:ss
        transaction.date = this.uploadService.excelDateToJSDate(
          item["Cut Off Date"],
        );

        // Find the associated vehicle
        const vehicleMatch = await this.vehicleService.findByVehicleNo(
          item["Vehicle No."].toString(),
        );
        if (vehicleMatch) {
          if (!vehicleMatch.isActive) {
            throw new InternalServerErrorException(
              Messages.vehicle.notActive(vehicleMatch.id),
            ); // Handle error
          }

          if (transaction.action === Action.OUT) {
            if (vehicleMatch.status === "occupied") {
              errorArray.push(
                `${Messages.vehicle.occupied(item["Vehicle No."])} at Data No. ${index + 1}`,
              );
              continue; // Skip to the next iteration
            }
            transaction.vehicle = vehicleMatch.id;
          } else if (transaction.action === Action.IN) {
            if (vehicleMatch.status === "available") {
              errorArray.push(
                `${Messages.vehicle.available(item["Vehicle No."])} at Data No. ${index + 1}`,
              );
              continue; // Skip to the next iteration
            }
            transaction.vehicle = vehicleMatch.id;
          }
        } else {
          errorArray.push(
            `Vehicle with number ${item["Vehicle No."]} not found at Data No. ${index + 1}`,
          );
          continue; // Skip to the next iteration
        }

        // Find the associated aggregator
        const aggregatorMatch = await this.aggregatorService.findOneByName(
          item["Aggregator"],
        );
        if (aggregatorMatch) {
          transaction.aggregator = aggregatorMatch.name;
        } else {
          errorArray.push(
            `Aggregator ${item["Aggregator"]} not found at Data No. ${index + 1}`,
          );
          continue; // Skip to the next iteration
        }

        // Find the associated employees
        const employeeMatch = await this.employeeService.findByCode(
          item["XDS No."],
        );
        if (employeeMatch) {
          if (employeeMatch.status === "inactive") {
            errorArray.push(
              `${Messages.employee.inactive(item["XDS No."])} at Data No. ${index + 1}`,
            );
            continue; // Skip to the next iteration
          }

          const { data: employeeLastTransaction } =
            await this.getEmployeeLatestTransaction(employeeMatch.id);

          if (
            employeeLastTransaction &&
            employeeLastTransaction.action === Action.OUT
          ) {
            errorArray.push(
              Messages.employee.isOccupied(
                item["XDS No."],
                employeeLastTransaction.vehicle.vehicleNo,
              ),
            );
            continue; // Skip to the next iteration
          }

          if (
            transaction.action === "out" &&
            employeeLastTransaction &&
            employeeLastTransaction.action === Action.OUT
          ) {
            errorArray.push(
              Messages.employee.isOccupied(
                employeeMatch.id,
                employeeLastTransaction.vehicle.vehicleNo,
              ),
            );
            continue; // Skip to the next iteration
          }
          if (
            transaction.action === "in" &&
            employeeLastTransaction &&
            employeeLastTransaction.action === Action.IN
          ) {
            errorArray.push(
              "Employee is already available cant check in",

            );
            continue; // Skip to the next iteration
          }
          if (
            transaction.action === "in" &&
            employeeLastTransaction &&
            employeeLastTransaction.action === Action.IN &&
            employeeLastTransaction.vehicle.vehicleNo !== vehicleMatch.vehicleNo
          ) {
            errorArray.push(
              Messages.employee.differentVehicle(
                employeeMatch.id,
                employeeLastTransaction.vehicle.vehicleNo,
              ),
            );
            continue; // Skip to the next iteration
          }

          transaction.employee = employeeMatch.id;
        } else {
          errorArray.push(
            `Employee with XDS No. ${item["XDS No."]} not found at Data No. ${index + 1}`,
          );
          continue; // Skip to the next iteration
        }

        // Find the associated location
        const locationMatch = await this.locationService.findByName(
          item["Location"],
        );
        if (locationMatch) {
          transaction.location = locationMatch.id;
        } else {
          errorArray.push(
            `Location with name ${item["Location"]} not found at Data No. ${index + 1}`,
          );
          continue; // Skip to the next iteration
        }

        // Set additional fields if necessary
        transaction.comments = ""; // Default empty comments, update if needed

        // Save the transaction and add to the result list
        const savedTransaction = await this.create(transaction);
        transactions.push(savedTransaction);
      } catch (error) {
        errorArray.push(
          `Error processing item at Data No. ${index + 1}: ${error.message}`,
        );
      }
    }

    return errorArray;
  }

  async getEmployeeLatestTransaction(
    employeeId: number,
  ): Promise<response<Transaction>> {
    try {
      const latestTransaction = await this.transactionRepository.findOne({
        where: { employee: { id: employeeId } },
        order: { createdAt: "DESC" },
        relations: ["vehicle", "employee", "location", "user"], // Include related entities if needed
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
    } catch (error) {
      this.logger.error(
        `[TransactionService] [getLatestTransaction] Error: ${error.message}`,
      );
      throw new HttpException(
        "Failed to retrieve the latest transaction.",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
