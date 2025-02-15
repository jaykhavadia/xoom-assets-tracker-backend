import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as mysql from "mysql2/promise";
import * as ExcelJS from "exceljs";
import * as fs from "fs";
import * as nodemailer from "nodemailer";
import { EmployeeService } from "../employee/employee.service";

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(private readonly employeeService: EmployeeService) {}

  @Cron("0 0 * * *") // Runs daily at 2 AM
  async backupDatabase() {
    try {
      this.logger.log("Starting database backup...");

      // Step 1: Connect to MySQL
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });

      // Step 2: Fetch all tables
      const [tables]: any = await connection.query("SHOW TABLES");

      const workbook = new ExcelJS.Workbook();

      for (const table of tables) {
        const tableName: any = Object.values(table)[0];
        const [rows]: any = await connection.query(
          `SELECT * FROM ${tableName}`,
        );

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

      // Step 3: Add Custom Sheet "Drivers"
      this.logger.log("Fetching driver data...");
      const employees = await this.employeeService.findAll();
      const driverSheet = workbook.addWorksheet("CustomDrivers");

      if (employees.length > 0) {
        // Add column headers
        driverSheet.columns = [
          { header: "ID", key: "id" },
          { header: "Code", key: "code" },
          { header: "Name", key: "name" },
          { header: "Status", key: "status" },
          { header: "Is Deleted", key: "isDeleted" },
          { header: "vehicleID", key: "vehicleID" },
          { header: "vehicleNo", key: "vehicleNo" },
          { header: "vehicleCode", key: "vehicleCode" },
          { header: "vehicleEmirates", key: "vehicleEmirates" },
          { header: "Aggregator", key: "aggregator" },
        ];

        // Add data rows
        employees.forEach((employee) => {
          driverSheet.addRow({
            id: employee.id,
            code: employee.code,
            name: employee.name,
            status: employee.status,
            isDeleted: employee.isDeleted,
            vehicleID: employee?.vehicle ? employee?.vehicle.id : "N/A",
            vehicleNo: employee?.vehicle ? employee?.vehicle.vehicleNo : "N/A",
            vehicleCode: employee?.vehicle ? employee?.vehicle.code : "N/A",
            vehicleEmirates: employee?.vehicle ? employee?.vehicle.emirates : "N/A",
            aggregator: employee?.aggregator ? employee?.aggregator : "N/A",
          });
        });
      }

      // Step 4: Save Excel file
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupDir = "./backups";

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const backupFilePath = `${backupDir}/db-backup-${timestamp}.xlsx`;

      await workbook.xlsx.writeFile(backupFilePath);

      this.logger.log(`Backup saved at: ${backupFilePath}`);

      // Step 4: Send Email with Backup
      await this.sendEmail(backupFilePath);

      // Optional: Delete old backups (older than 7 days)
      this.cleanupOldBackups();
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
    }
  }

  private async sendEmail(backupFilePath: string) {
    try {
      this.logger.log("Sending backup via email...");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // App password
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
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
    }
  }

  private cleanupOldBackups() {
    const backupDir = "./backups";
    if (!fs.existsSync(backupDir)) return;

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
}
