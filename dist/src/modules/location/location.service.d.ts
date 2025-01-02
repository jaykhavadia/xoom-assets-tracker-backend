import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
export declare class LocationService {
    private readonly locationRepository;
    constructor(locationRepository: Repository<Location>);
    create(location: Location): Promise<Location>;
    findAll(): Promise<Location[]>;
    findOne(id: number): Promise<Location>;
    update(id: number, location: Location): Promise<Location>;
    remove(id: number): Promise<void>;
}
