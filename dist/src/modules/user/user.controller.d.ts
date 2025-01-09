import { UserService } from './user.service';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService);
    create(userData: User): Promise<response<User>>;
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: User[];
    }>;
    findOne(id: string): Promise<response<User>>;
    update(id: string, updateData: Partial<User>): Promise<response<User>>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        data: null;
    }>;
}
