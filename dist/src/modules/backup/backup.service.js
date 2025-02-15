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
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mysql = require("mysql2/promise");
const ExcelJS = require("exceljs");
const fs = require("fs");
const nodemailer = require("nodemailer");
const employee_service_1 = require("../employee/employee.service");
let BackupService = BackupService_1 = class BackupService {
    constructor(employeeService) {
        this.employeeService = employeeService;
        this.logger = new common_1.Logger(BackupService_1.name);
    }
    async backupDatabase() {
        try {
            this.logger.log("Starting database backup...");
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            });
            const [tables] = await connection.query("SHOW TABLES");
            const workbook = new ExcelJS.Workbook();
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
                const worksheet = workbook.addWorksheet(tableName);
                if (rows.length > 0) {
                    worksheet.columns = Object.keys(rows[0]).map((key) => ({
                        header: key,
                        key: key,
                    }));
                    rows.forEach((row) => worksheet.addRow(row));
                }
            }
            await connection.end();
            this.logger.log("Fetching driver data...");
            const employees = await this.employeeService.findAll();
            const driverSheet = workbook.addWorksheet("CustomDrivers");
            if (employees.length > 0) {
                driverSheet.columns = [
                    { header: "ID", key: "id" },
                    { header: "Code", key: "code" },
                    { header: "Name", key: "name" },
                    { header: "Status", key: "status" },
                    { header: "Is Deleted", key: "isDeleted" },
                    { header: "Vehicle", key: "vehicle" },
                    { header: "Aggregator", key: "aggregator" },
                ];
                employees.forEach((employee) => {
                    driverSheet.addRow({
                        id: employee.id,
                        code: employee.code,
                        name: employee.name,
                        status: employee.status,
                        isDeleted: employee.isDeleted,
                        vehicle: employee?.vehicle ? employee?.vehicle.id : "N/A",
                        aggregator: employee?.aggregator ? employee?.aggregator : "N/A",
                    });
                });
            }
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const backupDir = "./backups";
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            const backupFilePath = `${backupDir}/db-backup-${timestamp}.xlsx`;
            await workbook.xlsx.writeFile(backupFilePath);
            this.logger.log(`Backup saved at: ${backupFilePath}`);
            await this.sendEmail(backupFilePath);
            this.cleanupOldBackups();
        }
        catch (error) {
            this.logger.error(`Backup failed: ${error.message}`);
        }
    }
    async sendEmail(backupFilePath) {
        try {
            this.logger.log("Sending backup via email...");
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.SEND_TO_EMAIL,
                subject: "Daily Database Backup",
                text: "Attached is the latest MySQL backup in Excel format.",
                attachments: [
                    {
                        filename: backupFilePath.split("/").pop(),
                        path: backupFilePath,
                    },
                ],
            });
            this.logger.log("Backup email sent successfully.");
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
        }
    }
    cleanupOldBackups() {
        const backupDir = "./backups";
        if (!fs.existsSync(backupDir))
            return;
        const files = fs.readdirSync(backupDir);
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        files.forEach((file) => {
            const filePath = `${backupDir}/${file}`;
            const stats = fs.statSync(filePath);
            if (stats.mtimeMs < sevenDaysAgo) {
                fs.unlinkSync(filePath);
                this.logger.log(`Deleted old backup: ${file}`);
            }
        });
    }
};
exports.BackupService = BackupService;
__decorate([
    (0, schedule_1.Cron)("0 0 * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupService.prototype, "backupDatabase", null);
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], BackupService);
//# sourceMappingURL=backup.service.js.map