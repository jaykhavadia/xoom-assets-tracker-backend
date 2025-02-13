import { VehicleService } from "./vehicle.service";
import { Vehicle } from "./entities/vehical.entity";
import { UploadService } from "src/common/upload/upload.service";
import { SheetService } from "../sheet/sheet.service";
import { GoogleDriveService } from "src/common/google-drive/google-drive.service";
import { VehicleDto } from "./dto/create-vehicle.dto";
import { VehicleQueryService } from "./vehicleQuery.service";
export declare class VehicleController {
    private readonly vehicleService;
    private readonly vehicleQueryService;
    private readonly uploadService;
    private readonly sheetService;
    private readonly googleDriveService;
    private readonly logger;
    constructor(vehicleService: VehicleService, vehicleQueryService: VehicleQueryService, uploadService: UploadService, sheetService: SheetService, googleDriveService: GoogleDriveService);
    create(vehicle: VehicleDto): Promise<response<Vehicle>>;
    findAll(status?: string): Promise<response<Vehicle[]>>;
    update(id: string, vehicle: VehicleDto): Promise<response<Vehicle>>;
    remove(id: string): Promise<response<void>>;
    uploadExcel(file: Express.Multer.File): Promise<response<void>>;
    bulkUpdate(file: Express.Multer.File): Promise<response<void>>;
    getFilteredVehicles(model?: string, ownedBy?: string, vehicleType?: string, aggregatorName?: string): Promise<response<Vehicle[]>>;
    getVehicleCountByAggregator(): Promise<response<any>>;
    getVehicleCountByModel(): Promise<response<any>>;
    getVehicleCountByOwner(): Promise<response<any>>;
    getVehicleCountByVehicleType(): Promise<response<any>>;
    getVehiclesByLocationName(locationName?: string): Promise<response<Vehicle[]>>;
    getVehicleCountByModelAndAggregator(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getVehicleCountByAggregatorAndModel(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getVehicleCountByOwnerAndAggregator(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getVehicleCountByAggregatorAndCategory(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getVehicleCountByAggregatorEmiratesAndCategory(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getVehicleCountByEmiratesAndCategoryFuel(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getVehicleCountByEmiratesAndOwnedBy(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getCategoryOperationByEmirates(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getEmiratesCategoryCount(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getExpiryStatus(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findOne(id: string): Promise<response<Vehicle>>;
}
