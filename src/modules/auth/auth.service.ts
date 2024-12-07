// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findByEmail(email);
            if (user && (await bcrypt.compare(password, user.password))) {
                const { password, ...result } = user; // Exclude the password from the response
                return result;
            }
            throw new UnauthorizedException('Invalid credentials');
        } catch (error) {
            console.log("[AuthService] [validateUser] error:", error)
            throw error;
        }
    }

    async login(user: any): Promise<{ user: any, accessToken: string }> {
        try {
            const payload = { email: user.email, sub: user.id, role: user.role };
            return {
                user,
                accessToken: this.jwtService.sign(payload),
            };
        } catch (error) {
            console.log("[AuthService] [login] error:", error)
            throw error;
        }
    }
}
