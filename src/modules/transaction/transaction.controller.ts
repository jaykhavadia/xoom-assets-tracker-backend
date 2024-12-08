import {
  Controller, Post, Put, Get, Delete, Param, Body, UploadedFiles, UseInterceptors, ValidationPipe, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Transaction } from './entities/transaction.entity';
import { FilesHelperService } from 'src/common/files-helper/files-helper.service';
import { Messages } from 'src/constants/messages.constants';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly transactionService: TransactionService,
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
  // {vehiclePictures: {back: 'File'}, {front: 'File'}, {left: 'File'}, ...}
  async create(
    @Body(new ValidationPipe()) body: CreateTransactionDto,
    @UploadedFiles() files?: { [key: string]: Express.Multer.File[] }
  ): Promise<response<Transaction>> {
    try {
      // const transactionData = JSON.parse(body);
      // Create the transaction first without saving the pictures yet
      const transaction = await this.transactionService.create(body);
      // Save the files using the generated transactionId
      // const savedFiles = await this.filesHelperService.saveTransactionFiles(files, transaction.id);
      // Update the transaction with the saved file URLs
      const updatedTransaction = await this.transactionService.update(transaction.id, { ...body, pictures: null });
      this.logger.log(Messages.transaction.createSuccess); // Log success message
      return {
        success: true,
        message: Messages.transaction.createSuccess,
        data: updatedTransaction, // Return the updated transaction
      };
    } catch (error) {
      this.logger.error(`[TransactionController] [create] Error: ${error.message}`); // Log error
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); // Handle error
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
}
