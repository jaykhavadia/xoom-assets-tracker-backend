import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<User>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
