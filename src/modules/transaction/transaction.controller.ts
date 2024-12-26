import {
  Controller, Post, Put, Get, Delete, Param, Body, UploadedFiles, UseInterceptors, ValidationPipe, HttpException, HttpStatus, Logger,
  UseGuards,
  Query,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Transaction } from './entities/transaction.entity';
import { FilesHelperService } from 'src/common/files-helper/files-helper.service';
import { Messages } from 'src/constants/messages.constants';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/CreateTransaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UploadService } from 'src/common/upload/upload.service';
import { Sheet } from '../sheet/entities/sheet.entity';
import { format } from 'date-fns';
import { SheetService } from '../sheet/sheet.service';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly uploadService: UploadService,
    private readonly sheetService: SheetService,
    private readonly filesHelperService: FilesHelperService,
  ) { }

  /**
   * Creates a new transaction.
   * @param transactionDto - The transaction data.
   * @param files - The uploaded files for the transaction.
   * @returns The created transaction.
   */
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'vehiclePictures[back]', maxCount: 1 },
    { name: 'vehiclePictures[front]', maxCount: 1 },
    { name: 'vehiclePictures[left]', maxCount: 1 },
    { name: 'vehiclePictures[right]', maxCount: 1 },
  ]))
  async create(
    @Body(new ValidationPipe()) body: CreateTransactionDto,
    @UploadedFiles() files?: { [key: string]: Express.Multer.File[] }
  ): Promise<response<Transaction>> {
    try {
      // const transactionData = JSON.parse(body);
      // Create the transaction first without saving the pictures yet
      let transaction = await this.transactionService.create(body);
      if (files && Object.keys(files).length > 0) {
        // Save the files using the generated transactionId
        const savedFiles = await this.filesHelperService.saveTransactionFiles(files, transaction.id);
        // Update the transaction with the saved file URLs
        transaction = await this.transactionService.updateTransaction(transaction.id, { ...transaction, pictures: savedFiles });
      }
      this.logger.log(Messages.transaction.createSuccess); // Log success message
      return {
        success: true,
        message: Messages.transaction.createSuccess,
        data: transaction, // Return the updated transaction
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [create] Error: ${error.message}`); // Log error
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // Handle error
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: UpdateTransactionDto,
  ): Promise<response<Transaction>> {
    try {
      const updatedTransaction = await this.transactionService.update(Number(id), body);
      return {
        success: true,
        message: Messages.transaction.updateSuccess(Number(id)),
        data: updatedTransaction, // Return the updated transaction
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [update] Error: ${error.message}`); // Log error
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // Handle error
    }
  }

  /**
   * Retrieves all transactions.
   * @returns An array of transactions.
   */
  @Get()
  async findAll(): Promise<response<Transaction[]>> {
    try {
      const transactions = await this.transactionService.findAll(); // Fetch all transactions
      this.logger.log(Messages.transaction.findAllSuccess); // Log success message
      return {
        success: true,
        message: Messages.transaction.findAllSuccess,
        data: transactions, // Return all transactions
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [findAll] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.transaction.findAllFailure, HttpStatus.BAD_REQUEST); // Handle error
    }
  }

  /**
   * Deletes a transaction by its ID.
   * @param id - The ID of the transaction to delete.
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<response<void>> {
    const transactionId = parseInt(id, 10); // Parse the ID from the URL
    try {
      await this.transactionService.remove(transactionId); // Remove the transaction
      this.logger.log(Messages.transaction.removeSuccess(transactionId)); // Log success message
      return {
        success: true,
        message: Messages.transaction.removeSuccess(transactionId), // Return success message
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [remove] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.transaction.removeFailure(transactionId), HttpStatus.BAD_REQUEST); // Handle error
    }
  }

  @Get('filter')
  async getTransactionsByDate(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('months') months?: number,
    @Query('date') date?: string
  ): Promise<response<Transaction[]>> {
    try {
      const transactions = await this.transactionService.getTransactionsByDateRange(
        from,
        to,
        months,
        date
      );

      return {
        success: true,
        message: 'Transactions fetched successfully.',
        data: transactions,
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [getTransactionsByDate] Error: ${error.message}`);
      throw new HttpException(
        'Failed to fetch transactions.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Retrieves a transaction by its ID.
   * @param id - The ID of the transaction to retrieve.
   * @returns The found transaction.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<response<Transaction>> {
    const transactionId = parseInt(id, 10); // Parse the ID from the URL
    try {
      const transaction = await this.transactionService.findOne(transactionId); // Fetch transaction by ID
      this.logger.log(Messages.transaction.findOneSuccess(transactionId)); // Log success message
      return {
        success: true,
        message: Messages.transaction.findOneSuccess(transactionId),
        data: transaction, // Return the found transaction
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [findOne] Error: ${error.message}`); // Log error
      throw new HttpException(Messages.transaction.findOneFailure(transactionId), HttpStatus.BAD_REQUEST); // Handle error
    }
  }

  /**
     * Endpoint to upload transaction from an Excel file.
     * @param file - The Excel file containing employee data.
     */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<response<void>> {
    try {
      const fileResponse = await this.uploadService.readExcel(file, 'transaction');
      // Save transaction to the database
      if ('transactions' in fileResponse) {
        // Save transaction to the database
        const filteredTransaction = fileResponse.transactions.filter((item) => item !== undefined); // Assuming you have a createBulk method
        filteredTransaction.map(async (transaction) => {
          console.log("🚀 ~ TransactionController ~ filteredTransaction.map ~ transaction:", transaction)
          await this.transactionService.create(transaction);
        });
      } else {
        throw new Error('Unexpected file response type for transaction.');
      }

      // Prepare data for the Sheet entity
      const sheetData: Partial<Sheet> = {
        uploadedAt: new Date(), // Current date and time
        uploadedAtTime: format(new Date(), 'hh:mm a'), // Format the time as '10:30 AM'
        fileUrl: file.originalname, // Assuming the file path is stored in 'file.path'
        type: 'Transaction', // Assuming the file path is stored in 'file.path'
      };

      // Save the Sheet entry to the database
      const sheetDetails = await this.sheetService.create(sheetData); // Create a new Sheet entry
      // const sheetId = sheetDetails.id;
      // // The ID of the parent folder where the new folder should be created
      // const parentFolderId = '1ksRPuN_aGdLS7NeRKdbH7br1E1vaB7Nl'; // Replace with your folder ID

      // // Create the folder named {sheetId} inside the specified parent folder
      // const sheetFolderId = await this.googleDriveService.getOrCreateFolder(sheetId.toString(), parentFolderId);

      // const directoryPath = path.join('src', 'uploads', 'employee');
      // const fileName = file.originalname;
      // // Ensure the directory exists (create it recursively if it doesn't)
      // mkdirp.sync(directoryPath);
      // // Write the image data to the file
      // const filePath = path.join(directoryPath, fileName);
      // fs.writeFileSync(filePath, file.buffer);

      // console.log("Checking if file exists at:", filePath);
      // if (!fs.existsSync(filePath)) {
      //   console.error("File does not exist:", filePath);
      //   throw new Error("File not found");
      // }
      // await this.googleDriveService.uploadFile(filePath, sheetFolderId);
      // // Clean up the temporary file after uploading
      // await fs.promises.unlink(filePath);

      return {
        success: true,
        message: Messages.employee.updateBulkSuccess,
        errorArray: fileResponse.errorArray
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [uploadExcel] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('upload-fine')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFineExcel(@UploadedFile() file: Express.Multer.File): Promise<response<any>> {
    try {
      const fileResponse = await this.uploadService.readExcel(file, 'fine');
      // Save transaction to the database
      if ('fine' in fileResponse) {
        // Save transaction to the database
        const filteredTransaction = fileResponse.fine.filter((item) => item !== undefined); // Assuming you have a createBulk method
      } else {
        throw new Error('Unexpected file response type for transaction.');
      }
      return {
        success: true,
        message: 'Fine Allocated',
        data: fileResponse.fine,
        errorArray: fileResponse.errorArray
      };
    } catch (error) {
      this.logger.error(`[EmployeeController] [uploadExcel] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
