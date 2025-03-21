import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { Messages } from "src/constants/messages.constants";
import { Aggregator } from "src/modules/aggregator/entities/aggregator.entity";
import { Employee } from "src/modules/employee/entities/employee.entity";
import { Location } from "src/modules/location/entities/location.entity";
import { Model } from "src/modules/model/entities/model.entity";
import { OwnedBy } from "src/modules/owned-by/entities/owned_by.entity";
import { CreateTransactionDto } from "src/modules/transaction/dto/CreateTransaction.dto";
import {
  Action,
  Transaction,
} from "src/modules/transaction/entities/transaction.entity";
import { VehicleType } from "src/modules/vehicle-type/entities/vehicle-type.entity";
import { Vehicle } from "src/modules/vehicle/entities/vehical.entity";
import { Brackets, Repository } from "typeorm";
import * as XLSX from "xlsx";

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepository: Repository<VehicleType>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(OwnedBy)
    private readonly ownedByRepository: Repository<OwnedBy>,
    @InjectRepository(Aggregator)
    private readonly aggregatorRepository: Repository<Aggregator>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;

  validateTime = (input: string): boolean => {
    if (this.timeRegex.test(input)) {
      return true;
    } else {
      return false;
    }
  };

  async readExcel(
    file: Express.Multer.File,
    type: string,
  ): Promise<
    | { vehicles: Vehicle[]; errorArray: string[] }
    | { employees: Employee[]; errorArray: string[] }
    | { transactions: CreateTransactionDto[]; errorArray: string[] }
    | { fine: any[]; errorArray: string[] }
    | { activeInactive: any[]; errorArray: string[] }
  > {
    try {
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet name
      const worksheet = workbook.Sheets[sheetName]; // Get the worksheet
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON

      const vehicle = await this.vehicleRepository.find();
      const transaction = await this.transactionRepository.find();
      const location = await this.locationRepository.find();
      const employee = await this.employeeRepository.find();
      const vehicleTypes = await this.vehicleTypeRepository.find();
      const models = await this.modelRepository.find();
      const ownedBy = await this.ownedByRepository.find();
      const aggregator = await this.aggregatorRepository.find();

      // Check if jsonData has at least one item to determine the sheet type
      if (jsonData.length > 0) {
        if (
          Object.keys(jsonData[0]).includes("Code") &&
          Object.keys(jsonData[0]).includes("Plate No.") &&
          Object.keys(jsonData[0]).includes("Status") &&
          type === "activeInactive"
        ) {
          return await this.processActiveInactive(jsonData, vehicle);
        } else if (
          Object.keys(jsonData[0]).includes("Code") &&
          type === "vehicle"
        ) {
          return await this.processVehicle(
            jsonData,
            models,
            vehicleTypes,
            ownedBy,
            aggregator,
            vehicle,
            location,
          );
        } else if (
          Object.keys(jsonData[0]).includes("E code") &&
          type === "employee"
        ) {
          return await this.processEmployee(jsonData, employee);
        } else if (
          Object.keys(jsonData[0]).includes("Trip Date") &&
          Object.keys(jsonData[0]).includes("Code") &&
          type === "fine"
        ) {
          return await this.processFine(jsonData, vehicle);
        } else {
          console.warn(`Unrecognized sheet format in sheet: ${sheetName}`);
          throw new Error("Unrecognized sheet format");
        }
      } else {
        console.warn("No data found in the uploaded Excel sheet.");
        throw new Error("No data found");
      }
    } catch (error) {
      console.error("[UploadService] [readExcel] error:", error);
      throw error;
    }
  }

  excelDateToJSDate = (serial: number): Date => {
    try {
      // Excel's date system starts from 1900-01-01, but it's incorrectly considering 1900 as a leap year
      const startDate = moment("1900-01-01"); // This is 1900-01-01 in UTC
      const correctedDate = startDate.add(serial - 2, "days"); // Adjust by -2 for the Excel offset and leap year bug

      // Adjust the date to UTC and then apply your desired time offset
      const adjustedDate = correctedDate.utcOffset(0, true); // Ensure we stay in UTC timezone

      return adjustedDate.toDate(); // Return the JavaScript Date object
    } catch (error) {
      console.error("UploadService ~ excelDateToJSDate ~ error:", error);
      throw new Error("inCorrect Date Format");
    }
  };

  excelDateToJSDateTransaction = (serial: number | string): string => {
    try {
      // Ensure `serial` is not null or undefined
      if (!serial) {
        throw new Error("Invalid input: serial date is required");
      }

      // Handle the case where `serial` is a string like '02-Oct-24'
      if (typeof serial === "string" && isNaN(Number(serial))) {
        const parts = serial.split("-");
        if (parts.length !== 3) {
          throw new Error("Invalid date string format");
        }

        const [day, monthStr, year] = parts;
        const month = new Date(`${monthStr} 1, 2000`).getMonth() + 1; // Convert month name to number
        const formattedYear = year.length === 2 ? `20${year}` : year; // Handle two-digit year
        return `${formattedYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }

      // Handle the case where `serial` is a number (Excel serial date)
      if (typeof serial === "number" || !isNaN(Number(serial))) {
        const excelStartDate = new Date(1900, 0, 1); // Excel starts from 1900-01-01
        const jsDate = new Date(
          excelStartDate.getTime() + (Number(serial) - 2) * 24 * 60 * 60 * 1000,
        ); // Adjust for leap year bug in Excel
        return jsDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      }

      // Throw an error for unexpected input types
      throw new Error("Invalid input: serial date must be a string or number");
    } catch (error) {
      console.error(
        "UploadService ~ excelDateToJSDateTransaction ~ error:",
        error,
      );
      throw new Error("inCorrect Date Format");
    }
  };

  excelTimeTo24HourFormat = (excelTime: number): string => {
    try {
      // Excel time is a fraction of a day
      const totalSeconds = Math.round(excelTime * 24 * 60 * 60); // Total seconds in the day
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Format as HH:mm:ss
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } catch (error) {
      throw new Error("inCorrect Time Format");
    }
  };

  processFine = async (
    jsonData: any,
    vehicles: Vehicle[],
  ): Promise<{ fine: any[]; errorArray: string[] }> => {
    const errorArray = [];

    const fineResponse = await jsonData.map(async (item, index) => {
      try {
        const {
          "Trip Date": tripDate,
          "Trip Time": tripTime,
          Plate,
          "Amount(AED)": amount,
          Code,
        } = item;

        // Parse the date and time
        if (this.validateTime(tripTime)) {
          console.error("[DEBUG] Time format is valid:", tripTime);
        } else {
          errorArray.push(
            `Incorrect Time Format at Data No. ${index + 1} Expected HH:MM:SS AM/PM Got ${tripTime}`,
          );
          return;
        }

        const date = new Date(this.excelDateToJSDate(tripDate));

        const time = this.convertTo24HourFormat(tripTime);

        // Find the associated vehicle
        const vehicleMatch = vehicles.find(
          (vehicle) =>
            vehicle.vehicleNo === Plate.toString() &&
            vehicle.code === Code.toString(),
        );
        if (!vehicleMatch) {
          errorArray.push(`Vehicle with number ${Plate} not found.`);
          return null; // Return null if vehicle not found
        }

        const vehicleNo = vehicleMatch.vehicleNo;

        const inputDate = new Date(date);
        if (isNaN(inputDate.getTime()) || inputDate.getFullYear() <= 2020) {
          errorArray.push(
            `Invalid date ${inputDate} format provided at ${index + 1}.`,
          );
          return;
        }

        const targetISODate = new Date(date).toISOString().split("T")[0]; // "2025-01-29"

        let result = await this.transactionRepository
          .createQueryBuilder("t")
          .innerJoinAndSelect("t.vehicle", "v", "v.vehicleNo = :vehicleNo", {
            vehicleNo,
          })
          .leftJoinAndSelect("t.employee", "employee")
          .leftJoinAndSelect("t.location", "location")
          .addSelect("location.name", "locationName")
          .where(
            new Brackets((qb) => {
              qb.where("t.date <= :targetDate", { targetDate: targetISODate }) // Ensure correct date filtering
                .andWhere(
                  new Brackets((subQb) => {
                    subQb
                      .where("t.date < :targetDate", {
                        targetDate: targetISODate,
                      })
                      .orWhere("t.date = :targetDate AND t.time <= :endTime", {
                        targetDate: targetISODate,
                        endTime: time,
                      });
                  }),
                );
            }),
          )
          .orderBy("t.date", "DESC") // Get the most recent transaction before the given date
          .addOrderBy("t.time", "DESC")
          .limit(1)
          .getOne();

        if (!result) {
          errorArray.push(`Something is wrong, No data found at ${index + 1}.`);
          return;
        }

        let details;
        if (result?.action === "out") {
          details = {
            employee_id: result.employee.id,
            employee_name: result.employee.name,
            employee_code: result.employee.code,
            transaction_vehicleId: result.vehicle.id,
            transaction_locationId: result.location.id,
          };
        } else {
          details = {
            emirates: result.vehicle.emirates,
            locationName: result.location.name,
          };
        }

        return { tripDate: targetISODate, tripTime, Plate, amount, details };
      } catch (error) {
        console.error(`[ERROR] Processing error at ${index + 1}:`, error);
        errorArray.push(
          `Unexpected error at Data No. ${index + 1}: ${error.message}`,
        );
      }
    });

    const results = await Promise.all(fineResponse);

    return {
      fine: results
        .flat()
        .filter((item) => item !== null && item !== undefined),
      errorArray,
    };
  };

  processActiveInactive = async (
    jsonData: any,
    vehicleDataSet: Vehicle[],
  ): Promise<{ activeInactive: Vehicle[]; errorArray: string[] }> => {
    const errorArray = [];
    const processActiveInactive: Vehicle[] = [];

    // If the first item has the key 'Vehicle No.', process as vehicles
    const vehiclePromises = jsonData.map(async (item) => {
      try {
        if (processActiveInactive.length) {
          // Check for duplicates
          processActiveInactive.forEach((processedVehicle: Vehicle) => {
            if (
              String(processedVehicle.vehicleNo) ===
                String(item["Plate No."]) &&
              String(processedVehicle.code) === String(item["Code"])
            ) {
              throw new Error(
                `Vehicle with No: ${item["Plate No."]} and Code No.: ${item["Code"]} are Duplicate in sheet`,
              );
            }
          });
        }

        const vehicleMatch = vehicleDataSet.find(
          (vehicleData) =>
            String(vehicleData.vehicleNo) === String(item["Plate No."]) &&
            String(vehicleData.code) === String(item["Code"]),
        );
        if (vehicleMatch) {
          vehicleMatch.isActive = item["Status"] === "Active" ? true : false;
        } else {
          errorArray.push(
            `Vehicle with No: ${item["Plate No."]} and Code No.: ${item["Code"]} are Not in DB`,
          );
          return;
        }

        processActiveInactive.push(vehicleMatch);
        return vehicleMatch;
      } catch (error) {
        errorArray.push(error.message);
      }
    });

    const resolvedVehicles = await Promise.all(vehiclePromises);

    return { activeInactive: resolvedVehicles, errorArray };
  };

  processVehicle = async (
    jsonData: any,
    models: Model[],
    vehicleTypes: VehicleType[],
    ownedBy: OwnedBy[],
    aggregators: Aggregator[],
    vehicleDataSet: Vehicle[],
    locations: Location[],
  ): Promise<{ vehicles: Vehicle[]; errorArray: string[] }> => {
    const errorArray = [];
    const processedVehicles: { vehicleNo: string; chasisNumber: string }[] = [];

    // If the first item has the key 'Vehicle No.', process as vehicles
    const vehiclePromises = jsonData.map(async (item) => {
      try {
        if (processedVehicles.length) {
          // Check for duplicates
          processedVehicles.forEach((processedVehicle) => {
            if (
              String(processedVehicle.vehicleNo) ===
                String(item["Vehicle No."]) ||
              processedVehicle.chasisNumber === item["Chasis No."]
            ) {
              throw new Error(
                `Vehicle with No: ${item["Vehicle No."]} OR Chasis No.: ${item["Chasis No."]} are Duplicate`,
              );
            }
          });
        }

        const vehicleMatch = vehicleDataSet.find(
          (vehicleData) =>
            String(vehicleData.vehicleNo) === String(item["Vehicle No."]) ||
            String(vehicleData.chasisNumber) === String(item["Chasis No."]),
        );
        if (vehicleMatch) {
          errorArray.push(
            `Vehicle with No: ${item["Vehicle No."]} OR Chasis No.: ${item["Chasis No."]} are Duplicate`,
          );
          return;
        }

        const vehicle = new Vehicle(); // Create an instance of the Vehicle class
        vehicle.code = item["Code"];
        vehicle.vehicleNo = item["Vehicle No."];

        const modelsMatch = models.find(
          (model) => model.brand === item["Model"],
        );
        if (modelsMatch) {
          vehicle.model = modelsMatch;
        } else {
          // const newModel = this.modelRepository.create({ brand: item['Model'] });
          // await this.modelRepository.save(newModel);
          // vehicle.model = newModel;
          errorArray.push(`Model with brand ${item["Model"]} not found.`);
          return;
        }

        const vehicleTypeMatch = vehicleTypes.find((vehicleType) => {
          return (
            vehicleType.name === item["Category"] &&
            vehicleType.fuel === item["Fuel"]
          );
        });
        if (vehicleTypeMatch) {
          vehicle.vehicleType = vehicleTypeMatch;
        } else {
          // const newVehicleType = this.vehicleTypeRepository.create({
          //     name: item['Category'],
          //     fuel: item['Fuel'],
          // });
          // await this.vehicleTypeRepository.save(newVehicleType);
          // vehicle.vehicleType = newVehicleType;
          errorArray.push(
            `vehicleType with Category ${item["Category"]} & Fuel ${item["Fuel"]} not found.`,
          );
          return;
        }

        const ownedByMatch = ownedBy.find(
          (owner) => owner.name === item["From"],
        );
        if (ownedByMatch) {
          vehicle.ownedBy = ownedByMatch;
        } else {
          // const newOwnedBy = this.ownedByRepository.create({ name: item['From'] });
          // await this.ownedByRepository.save(newOwnedBy);
          // vehicle.ownedBy = newOwnedBy;
          errorArray.push(`From(ownedBy) with name ${item["From"]} not found.`);
          return;
        }

        vehicle.chasisNumber = item["Chasis No."];
        vehicle.aggregator = aggregators.find(
          (aggregator) => aggregator.name === "idle",
        );

        vehicle.registrationExpiry = this.excelDateToJSDate(
          item["Expiry Date"],
        );
        vehicle.emirates = item["Emirates"];
        vehicle.status = item["Status"] || "available";
        vehicle.isActive = item["isActive"] || true;
        vehicle.isDeleted = item["isDeleted"] || false; // Default to false if not present
        processedVehicles.push({
          vehicleNo: item["Vehicle No."],
          chasisNumber: item["Chasis No."],
        });
        const locationMatched = locations.find(
          (location) => location.name === item["Location"],
        )?.name;
        if (!locationMatched) {
          errorArray.push(`${item["Location"]} -  Location, not found.`);
          return;
        }
        vehicle.location = locationMatched;

        return vehicle;
      } catch (error) {
        errorArray.push(error.message);
      }
    });

    const resolvedVehicles = await Promise.all(vehiclePromises);

    return { vehicles: resolvedVehicles, errorArray };
  };

  processEmployee = async (
    jsonData: any,
    employeeList: Employee[],
  ): Promise<{ employees: Employee[]; errorArray: string[] }> => {
    const errorArray = [];
    const employees: Employee[] = [];
    const processedEmployee: string[] = [];
    // If the first item has the key 'E code', process as employees
    employees.push(
      ...jsonData.map((item: any) => {
        try {
          // Find the associated employee
          const employeeMatch = employeeList.find(
            (employee) => employee.code === item["E code"],
          );
          if (employeeMatch) {
            errorArray.push(
              `Employee with E code ${item["E code"]} Already exist.`,
            );
            return;
          }
          if (processedEmployee.includes(item["E code"])) {
            errorArray.push(
              `Employee with E Code: ${item["E code"]} are Duplicate`,
            );
            return;
          }
          try {
            const employee = new Employee(); // Create an instance of the Employee class
            employee.name = item["Name"];
            employee.code = item["E code"];
            employee.status = item["Status"] || "Active";
            processedEmployee.push(item["E code"]);
            return employee;
          } catch (error) {
            console.error("[UploadService] [employees.push] error:", error);
            errorArray.push(
              `Employee with E Code ${item["E code"]} Failed to Add.`,
            );
            return;
          }
        } catch (error) {
          errorArray.push(error.message);
        }
      }),
    );
    return { employees, errorArray };
  };

  convertTo24HourFormat = (time: string): string => {
    try {
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
    } catch (error) {
      throw new Error("inCorrect Time format");
    }
  };
}
