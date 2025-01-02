import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
export declare class LocationController {
    private readonly locationService;
    private readonly logger;
    constructor(locationService: LocationService);
    create(location: Location): Promise<{
        success: boolean;
        message: string;
        data?: Location;
    }>;
    findAll(): Promise<{
        success: boolean;
        message: string;
        data?: Location[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data?: Location;
    }>;
    update(id: string, location: Location): Promise<{
        success: boolean;
        message: string;
        data?: Location;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
