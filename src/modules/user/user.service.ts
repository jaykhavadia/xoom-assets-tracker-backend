import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hashSync(userData.password, salt);
            const user = this.userRepository.create({ ...userData, password: hashedPassword });
            return this.userRepository.save(user);
        } catch (error) {
            console.log("[UserService] [create] error:", error);
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            console.log("[UserService] [findOne] error:", error);
            throw error;
        }
    }

    async update(id: string, updateData: Partial<User>): Promise<User> {
        try {
            if(updateData?.email){
                throw new Error("User Cant update Email");
            }
            const user = await this.findOne(id);
            if (updateData?.password) {
                const salt = await bcrypt.genSalt();
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            Object.assign(user, updateData);
            return this.userRepository.save(user);
        } catch (error) {
            console.log("[UserService] [update] error:", error)
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }
}
