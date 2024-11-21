// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            const decoded = this.jwtService.verify(token);
            request['user'] = decoded;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
