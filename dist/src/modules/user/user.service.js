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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hashSync(userData.password, salt);
            const user = this.userRepository.create({ ...userData, password: hashedPassword });
            return this.userRepository.save(user);
        }
        catch (error) {
            console.error("[UserService] [create] error:", error);
            throw error;
        }
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            console.error("[UserService] [findOne] error:", error);
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            if (updateData?.email) {
                throw new Error("User Cant update Email");
            }
            const user = await this.findOne(id);
            if (updateData?.password) {
                const salt = await bcrypt.genSalt();
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            Object.assign(user, updateData);
            return this.userRepository.save(user);
        }
        catch (error) {
            console.error("[UserService] [update] error:", error);
            throw error;
        }
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map