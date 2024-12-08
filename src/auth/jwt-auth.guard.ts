import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Role, User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = this.jwtService.verify(token);
            request['user'] = decoded;

            const user = await this.userRepository.findOne({ where: { id: decoded.sub } });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Role-based logic
            switch (user.role) {
                case Role.Owner:
                    return true; // Full access
                case Role.Viewer:
                    if (request.method !== 'GET') {
                        throw new ForbiddenException('Viewers can only view data.');
                    }
                    return true;
                case Role.Editor:
                    const allowedModules = ['vehicles', 'locations'];
                    const routePath = request.baseUrl || request.url;
                    if (!allowedModules.some((path) => routePath.includes(path))) {
                        throw new ForbiddenException('Editors can only manage vehicles and locations.');
                    }
                    return true;
                default:
                    throw new ForbiddenException('Access denied');
            }
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new UnauthorizedException(error.message);
            }
            throw new ForbiddenException(error.message);
        }
    }
}
