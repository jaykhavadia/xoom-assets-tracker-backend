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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment = require("moment");
const messages_constants_1 = require("../../constants/messages.constants");
const aggregator_entity_1 = require("../../modules/aggregator/entities/aggregator.entity");
const employee_entity_1 = require("../../modules/employee/entities/employee.entity");
const location_entity_1 = require("../../modules/location/entities/location.entity");
const model_entity_1 = require("../../modules/model/entities/model.entity");
const owned_by_entity_1 = require("../../modules/owned-by/entities/owned_by.entity");
const CreateTransaction_dto_1 = require("../../modules/transaction/dto/CreateTransaction.dto");
const transaction_entity_1 = require("../../modules/transaction/entities/transaction.entity");
const vehicle_type_entity_1 = require("../../modules/vehicle-type/entities/vehicle-type.entity");
const vehical_entity_1 = require("../../modules/vehicle/entities/vehical.entity");
const typeorm_2 = require("typeorm");
const XLSX = require("xlsx");
let UploadService = class UploadService {
    constructor(vehicleTypeRepository, modelRepository, ownedByRepository, aggregatorRepository, vehicleRepository, employeeRepository, locationRepository, transactionRepository) {
        this.vehicleTypeRepository = vehicleTypeRepository;
        this.modelRepository = modelRepository;
        this.ownedByRepository = ownedByRepository;
        this.aggregatorRepository = aggregatorRepository;
        this.vehicleRepository = vehicleRepository;
        this.employeeRepository = employeeRepository;
        this.locationRepository = locationRepository;
        this.transactionRepository = transactionRepository;
        this.timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;
        this.validateTime = (input) => {
            if (this.timeRegex.test(input)) {
                return true;
            }
            else {
                return false;
            }
        };
        this.excelDateToJSDate = (serial) => {
            try {
                const startDate = moment("1900-01-01");
                const correctedDate = startDate.add(serial - 2, "days");
                const adjustedDate = correctedDate.utcOffset(0, true);
                return adjustedDate.toDate();
            }
            catch (error) {
                console.error("UploadService ~ excelDateToJSDate ~ error:", error);
                throw new Error("inCorrect Date Format");
            }
        };
        this.excelDateToJSDateTransaction = (serial) => {
            try {
                if (!serial) {
                    throw new Error("Invalid input: serial date is required");
                }
                if (typeof serial === "string" && isNaN(Number(serial))) {
                    const parts = serial.split("-");
                    if (parts.length !== 3) {
                        throw new Error("Invalid date string format");
                    }
                    const [day, monthStr, year] = parts;
                    const month = new Date(`${monthStr} 1, 2000`).getMonth() + 1;
                    const formattedYear = year.length === 2 ? `20${year}` : year;
                    return `${formattedYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                }
                if (typeof serial === "number" || !isNaN(Number(serial))) {
                    const excelStartDate = new Date(1900, 0, 1);
                    const jsDate = new Date(excelStartDate.getTime() + (Number(serial) - 2) * 24 * 60 * 60 * 1000);
                    return jsDate.toISOString().split("T")[0];
                }
                throw new Error("Invalid input: serial date must be a string or number");
            }
            catch (error) {
                console.error("UploadService ~ excelDateToJSDateTransaction ~ error:", error);
                throw new Error("inCorrect Date Format");
            }
        };
        this.excelTimeTo24HourFormat = (excelTime) => {
            try {
                const totalSeconds = Math.round(excelTime * 24 * 60 * 60);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            }
            catch (error) {
                throw new Error("inCorrect Time Format");
            }
        };
        this.processFine = async (jsonData, vehicles, employees, transaction) => {
            const errorArray = [];
            const fineResponse = await jsonData.map(async (item, index) => {
                try {
                    const { "Trip Date": tripDate, "Trip Time": tripTime, Plate, "Amount(AED)": amount, } = item;
                    if (this.validateTime(tripTime)) {
                        console.log("[DEBUG] Time format is valid:", tripTime);
                    }
                    else {
                        errorArray.push(`Incorrect Time Format at Data No. ${index + 1} Expected HH:MM:SS AM/PM Got ${tripTime}`);
                        return;
                    }
                    const date = new Date(this.excelDateToJSDate(tripDate));
                    const time = this.convertTo24HourFormat(tripTime);
                    const vehicleMatch = vehicles.find((vehicle) => vehicle.vehicleNo === Plate.toString());
                    if (!vehicleMatch) {
                        errorArray.push(`Vehicle with number ${Plate} not found.`);
                        return null;
                    }
                    const vehicleNo = vehicleMatch.vehicleNo;
                    const inputDate = new Date(date);
                    if (isNaN(inputDate.getTime()) || inputDate.getFullYear() <= 2020) {
                        errorArray.push(`Invalid date ${inputDate} format provided at ${index + 1}.`);
                        return;
                    }
                    const targetISODate = new Date(date).toISOString().split("T")[0];
                    let result = await this.transactionRepository
                        .createQueryBuilder("t")
                        .innerJoinAndSelect("t.vehicle", "v", "v.vehicleNo = :vehicleNo", {
                        vehicleNo,
                    })
                        .leftJoinAndSelect("t.employee", "employee")
                        .leftJoinAndSelect("t.location", "location")
                        .addSelect("location.name", "locationName")
                        .where(new typeorm_2.Brackets((qb) => {
                        qb.where("t.date <= :targetDate", { targetDate: targetISODate })
                            .andWhere(new typeorm_2.Brackets((subQb) => {
                            subQb
                                .where("t.date < :targetDate", {
                                targetDate: targetISODate,
                            })
                                .orWhere("t.date = :targetDate AND t.time <= :endTime", {
                                targetDate: targetISODate,
                                endTime: time,
                            });
                        }));
                    }))
                        .orderBy("t.date", "DESC")
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
                    }
                    else {
                        details = {
                            emirates: result.vehicle.emirates,
                            locationName: result.location.name,
                        };
                    }
                    return { tripDate: targetISODate, tripTime, Plate, amount, details };
                }
                catch (error) {
                    console.error(`[ERROR] Processing error at ${index + 1}:`, error);
                    errorArray.push(`Unexpected error at Data No. ${index + 1}: ${error.message}`);
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
        this.processTransaction = async (jsonData, vehicles, employees, locations, aggregators) => {
            const errorArray = [];
            const transactionPromises = jsonData.map(async (item, index) => {
                try {
                    const transaction = new CreateTransaction_dto_1.CreateTransactionDto();
                    transaction.action =
                        item["Status"] === "Check Out" ? transaction_entity_1.Action.OUT : transaction_entity_1.Action.IN;
                    if (this.validateTime(item["Cut Off Time"]) &&
                        !item["Cut Off Time"].includes("'") &&
                        (item["Cut Off Time"].includes("AM") ||
                            item["Cut Off Time"].includes("PM"))) {
                        console.log("The string contains AM or PM");
                    }
                    else {
                        errorArray.push(`inCorrect Time Format at Data No. ${index + 1} Expected HH:MM:SS AM/PM Got ${item["Cut Off Time"]}`);
                        return;
                    }
                    transaction.time = item["Cut Off Time"];
                    transaction.date = this.excelDateToJSDate(item["Cut Off Date"]);
                    const vehicleMatch = vehicles.find((vehicle) => vehicle.vehicleNo === item["Vehicle No."].toString());
                    if (vehicleMatch) {
                        if (!vehicleMatch.isActive) {
                            errorArray.push(`${messages_constants_1.Messages.vehicle.notActive(item["Vehicle No."])} at Data No. ${index + 1}`);
                            return;
                        }
                        if (transaction.action === "out") {
                            if (vehicleMatch.status === "occupied") {
                                errorArray.push(`${messages_constants_1.Messages.vehicle.occupied(item["Vehicle No."])} at Data No. ${index + 1}`);
                                return;
                            }
                            transaction.vehicle = vehicleMatch.id;
                        }
                        else if (transaction.action === "in") {
                            if (vehicleMatch.status === "available") {
                                errorArray.push(`${messages_constants_1.Messages.vehicle.available(item["Vehicle No."])} at Data No. ${index + 1}`);
                                return;
                            }
                            transaction.vehicle = vehicleMatch.id;
                        }
                    }
                    else {
                        errorArray.push(`Vehicle with number ${item["Vehicle No."]} not found. at Data No. ${index + 1}`);
                        return;
                    }
                    const aggregatorMatch = aggregators.find((aggregator) => aggregator.name === item["Aggregator"]);
                    if (aggregatorMatch) {
                        transaction.aggregator = aggregatorMatch.name;
                    }
                    else {
                        errorArray.push(`Aggregator ${item["Aggregator"]} not found. at Data No. ${index + 1}`);
                        return;
                    }
                    const employeeMatch = employees.find((employee) => employee.code === item["XDS No."]);
                    if (employeeMatch) {
                        if (employeeMatch.status === "inactive") {
                            errorArray.push(`${messages_constants_1.Messages.employee.inactive(item["XDS No."])} at Data No. ${index + 1}`);
                            return;
                        }
                        transaction.employee = employeeMatch.id;
                    }
                    else {
                        errorArray.push(`Employee with XDS No. ${item["XDS No."]} not found. at Data No. ${index + 1}`);
                        return;
                    }
                    const locationMatch = locations.find((location) => location.name === item["Location"]);
                    if (locationMatch) {
                        transaction.location = locationMatch.id;
                    }
                    else {
                        errorArray.push(`Location with name ${item["Location"]} not found. at Data No. ${index + 1}`);
                        return;
                    }
                    transaction.comments = "";
                }
                catch (error) {
                    errorArray.push(error.message);
                }
            });
            return { transactions: await Promise.all(transactionPromises), errorArray };
        };
        this.processActiveInactive = async (jsonData, vehicleDataSet) => {
            const errorArray = [];
            const processActiveInactive = [];
            const vehiclePromises = jsonData.map(async (item) => {
                try {
                    if (processActiveInactive.length) {
                        processActiveInactive.forEach((processedVehicle) => {
                            if (String(processedVehicle.vehicleNo) ===
                                String(item["Plate No."]) &&
                                String(processedVehicle.code) === String(item["Code"])) {
                                throw new Error(`Vehicle with No: ${item["Plate No."]} and Code No.: ${item["Code"]} are Duplicate in sheet`);
                            }
                        });
                    }
                    const vehicleMatch = vehicleDataSet.find((vehicleData) => String(vehicleData.vehicleNo) === String(item["Plate No."]) &&
                        String(vehicleData.code) === String(item["Code"]));
                    if (vehicleMatch) {
                        vehicleMatch.isActive = item["Status"] === "Active" ? true : false;
                    }
                    else {
                        errorArray.push(`Vehicle with No: ${item["Plate No."]} and Code No.: ${item["Code"]} are Not in DB`);
                        return;
                    }
                    processActiveInactive.push(vehicleMatch);
                    return vehicleMatch;
                }
                catch (error) {
                    errorArray.push(error.message);
                }
            });
            const resolvedVehicles = await Promise.all(vehiclePromises);
            return { activeInactive: resolvedVehicles, errorArray };
        };
        this.processVehicle = async (jsonData, models, vehicleTypes, ownedBy, aggregators, vehicleDataSet, locations) => {
            const errorArray = [];
            const processedVehicles = [];
            const vehiclePromises = jsonData.map(async (item) => {
                try {
                    if (processedVehicles.length) {
                        processedVehicles.forEach((processedVehicle) => {
                            if (String(processedVehicle.vehicleNo) ===
                                String(item["Vehicle No."]) ||
                                processedVehicle.chasisNumber === item["Chasis No."]) {
                                throw new Error(`Vehicle with No: ${item["Vehicle No."]} OR Chasis No.: ${item["Chasis No."]} are Duplicate`);
                            }
                        });
                    }
                    const vehicleMatch = vehicleDataSet.find((vehicleData) => String(vehicleData.vehicleNo) === String(item["Vehicle No."]) ||
                        String(vehicleData.chasisNumber) === String(item["Chasis No."]));
                    if (vehicleMatch) {
                        errorArray.push(`Vehicle with No: ${item["Vehicle No."]} OR Chasis No.: ${item["Chasis No."]} are Duplicate`);
                        return;
                    }
                    const vehicle = new vehical_entity_1.Vehicle();
                    vehicle.code = item["Code"];
                    vehicle.vehicleNo = item["Vehicle No."];
                    const modelsMatch = models.find((model) => model.brand === item["Model"]);
                    if (modelsMatch) {
                        vehicle.model = modelsMatch;
                    }
                    else {
                        errorArray.push(`Model with brand ${item["Model"]} not found.`);
                        return;
                    }
                    const vehicleTypeMatch = vehicleTypes.find((vehicleType) => {
                        return (vehicleType.name === item["Category"] &&
                            vehicleType.fuel === item["Fuel"]);
                    });
                    if (vehicleTypeMatch) {
                        vehicle.vehicleType = vehicleTypeMatch;
                    }
                    else {
                        errorArray.push(`vehicleType with Category ${item["Category"]} & Fuel ${item["Fuel"]} not found.`);
                        return;
                    }
                    const ownedByMatch = ownedBy.find((owner) => owner.name === item["From"]);
                    if (ownedByMatch) {
                        vehicle.ownedBy = ownedByMatch;
                    }
                    else {
                        errorArray.push(`From(ownedBy) with name ${item["From"]} not found.`);
                        return;
                    }
                    vehicle.chasisNumber = item["Chasis No."];
                    vehicle.aggregator = aggregators.find((aggregator) => aggregator.name === "idle");
                    vehicle.registrationExpiry = this.excelDateToJSDate(item["Expiry Date"]);
                    vehicle.emirates = item["Emirates"];
                    vehicle.status = item["Status"] || "available";
                    vehicle.isActive = item["isActive"] || true;
                    vehicle.isDeleted = item["isDeleted"] || false;
                    processedVehicles.push({
                        vehicleNo: item["Vehicle No."],
                        chasisNumber: item["Chasis No."],
                    });
                    const locationMatched = locations.find((location) => location.name === item["Location"])?.name;
                    if (!locationMatched) {
                        errorArray.push(`${item["Location"]} -  Location, not found.`);
                        return;
                    }
                    vehicle.location = locationMatched;
                    return vehicle;
                }
                catch (error) {
                    errorArray.push(error.message);
                }
            });
            const resolvedVehicles = await Promise.all(vehiclePromises);
            return { vehicles: resolvedVehicles, errorArray };
        };
        this.processEmployee = async (jsonData, employeeList) => {
            const errorArray = [];
            const employees = [];
            const processedEmployee = [];
            employees.push(...jsonData.map((item) => {
                try {
                    const employeeMatch = employeeList.find((employee) => employee.code === item["E code"]);
                    if (employeeMatch) {
                        errorArray.push(`Employee with E code ${item["E code"]} Already exist.`);
                        return;
                    }
                    if (processedEmployee.includes(item["E code"])) {
                        errorArray.push(`Employee with E Code: ${item["E code"]} are Duplicate`);
                        return;
                    }
                    try {
                        const employee = new employee_entity_1.Employee();
                        employee.name = item["Name"];
                        employee.code = item["E code"];
                        employee.status = item["Status"] || "Active";
                        processedEmployee.push(item["E code"]);
                        return employee;
                    }
                    catch (error) {
                        console.log("[UploadService] [employees.push] error:", error);
                        errorArray.push(`Employee with E Code ${item["E code"]} Failed to Add.`);
                        return;
                    }
                }
                catch (error) {
                    errorArray.push(error.message);
                }
            }));
            return { employees, errorArray };
        };
        this.convertTo24HourFormat = (time) => {
            try {
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
            }
            catch (error) {
                throw new Error("inCorrect Time format");
            }
        };
    }
    async readExcel(file, type) {
        try {
            const workbook = XLSX.read(file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const vehicle = await this.vehicleRepository.find();
            const transaction = await this.transactionRepository.find();
            const location = await this.locationRepository.find();
            const employee = await this.employeeRepository.find();
            const vehicleTypes = await this.vehicleTypeRepository.find();
            const models = await this.modelRepository.find();
            const ownedBy = await this.ownedByRepository.find();
            const aggregator = await this.aggregatorRepository.find();
            if (jsonData.length > 0) {
                if (Object.keys(jsonData[0]).includes("Code") &&
                    Object.keys(jsonData[0]).includes("Plate No.") &&
                    Object.keys(jsonData[0]).includes("Status")) {
                    if (type !== "activeInactive") {
                        throw new Error("INVALID_FILE");
                    }
                    return await this.processActiveInactive(jsonData, vehicle);
                }
                else if (Object.keys(jsonData[0]).includes("Code")) {
                    if (type !== "vehicle") {
                        throw new Error("INVALID_FILE");
                    }
                    return await this.processVehicle(jsonData, models, vehicleTypes, ownedBy, aggregator, vehicle, location);
                }
                else if (Object.keys(jsonData[0]).includes("E code")) {
                    if (type !== "employee") {
                        throw new Error("INVALID_FILE");
                    }
                    return await this.processEmployee(jsonData, employee);
                }
                else if (Object.keys(jsonData[0]).includes("Trip Date")) {
                    if (type !== "fine") {
                        throw new Error("INVALID_FILE");
                    }
                    return await this.processFine(jsonData, vehicle, employee, transaction);
                }
                else {
                    console.warn(`Unrecognized sheet format in sheet: ${sheetName}`);
                    throw new Error("Unrecognized sheet format");
                }
            }
            else {
                console.warn("No data found in the uploaded Excel sheet.");
                throw new Error("No data found");
            }
        }
        catch (error) {
            console.log("[UploadService] [readExcel] error:", error);
            throw error;
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_type_entity_1.VehicleType)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, typeorm_1.InjectRepository)(owned_by_entity_1.OwnedBy)),
    __param(3, (0, typeorm_1.InjectRepository)(aggregator_entity_1.Aggregator)),
    __param(4, (0, typeorm_1.InjectRepository)(vehical_entity_1.Vehicle)),
    __param(5, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(6, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(7, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UploadService);
//# sourceMappingURL=upload.service.js.map