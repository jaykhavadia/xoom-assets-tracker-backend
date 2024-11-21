// src/user/user.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body(new ValidationPipe()) userData: User): Promise<User> {
    return this.userService.create(userData);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<User>): Promise<User> {
    return this.userService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
