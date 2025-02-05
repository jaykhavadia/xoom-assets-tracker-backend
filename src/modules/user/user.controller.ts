// src/user/user.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserDto } from "./dto/create-user.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name); // Logger for logging errors and information

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) userData: UserDto,
  ): Promise<response<User>> {
    try {
      const response = await this.userService.create(userData);
      return {
        success: true,
        message: "User created successfully.",
        data: response,
      };
    } catch (error) {
      this.logger.error(`[UserController] [create] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<{
    success: boolean;
    message: string;
    data: User[];
  }> {
    try {
      const response = await this.userService.findAll();
      return {
        success: true,
        message: "Users retrieved successfully.",
        data: response,
      };
    } catch (error) {
      this.logger.error(`[UserController] [findAll] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<response<User>> {
    try {
      const response = await this.userService.findOne(id);
      return {
        success: true,
        message: "User retrieved successfully.",
        data: response,
      };
    } catch (error) {
      this.logger.error(`[UserController] [findOne] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateData: Partial<User>,
  ): Promise<response<User>> {
    try {
      const response = await this.userService.update(id, updateData);
      return {
        success: true,
        message: "User updated successfully.",
        data: response,
      };
    } catch (error) {
      this.logger.error(`[UserController] [update] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(":id")
  async remove(
    @Param("id") id: string,
  ): Promise<{ success: boolean; message: string; data: null }> {
    try {
      await this.userService.remove(id);
      return {
        success: true,
        message: "User removed successfully.",
        data: null,
      };
    } catch (error) {
      this.logger.error(`[UserController] [remove] Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
