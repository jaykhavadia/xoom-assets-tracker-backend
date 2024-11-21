// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/modules/user/entities/user.entity';

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
            const user = request['user']
            // Role-based conditions
            if (user.role === Role.Owner) {
                // Owner has no limitations, full access
                return true;
            }

            if (user.role === Role.Viewer) {
                // Viewer can only access 'GET' requests
                const request = context.switchToHttp().getRequest();
                if (request.method !== 'GET') {
                    throw new ForbiddenException('Access denied: Viewers can only access GET endpoints.');
                }
                return true;
            }

            if (user.role === Role.Editor) {
                // Editor can access CRUD for vehicle and location
                const allowedRoutes = ['vehicles', 'locations']; // Define accessible modules
                const request = context.switchToHttp().getRequest();
                const routePath = request.route.path; // Get the route path
                const isAllowed = allowedRoutes.some((path) => routePath.includes(path));

                if (!isAllowed) {
                    throw new ForbiddenException('Access denied: Editors can only manage vehicles and locations.');
                }
                return true;
            }

            // If none of the above conditions match, deny access
            throw new ForbiddenException('Access denied');
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
