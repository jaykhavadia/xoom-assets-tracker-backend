export declare const Messages: {
    employee: {
        createSuccess: string;
        createFailure: string;
        findAllSuccess: string;
        findAllFailure: string;
        findOneSuccess: (id: number) => string;
        findOneFailure: (id: number) => string;
        updateSuccess: (id: number) => string;
        updateFailure: (id: number) => string;
        removeSuccess: (id: number) => string;
        removeFailure: (id: number) => string;
        inactive: (id: number) => string;
        isOccupied: (id: number, vehicleId: string) => string;
        differentVehicle: (id: number, vehicleId: string) => string;
        updateBulkSuccess: string;
        updateBulkFailure: string;
    };
    vehicle: {
        createSuccess: string;
        createFailure: string;
        findAllSuccess: string;
        findAllFailure: string;
        invalidStatus: string;
        findOneSuccess: (id: string) => string;
        findOneFailure: (id: string) => string;
        updateSuccess: (id: string) => string;
        updateFailure: (id: string) => string;
        removeSuccess: (id: string) => string;
        removeFailure: (id: string) => string;
        updateBulkSuccess: string;
        updateBulkFailure: string;
        occupied: (id: string) => string;
        notActive: (id: string) => string;
        available: (id: string) => string;
    };
    location: {
        createSuccess: string;
        createFailure: string;
        findAllSuccess: string;
        findAllFailure: string;
        findOneSuccess: (id: number) => string;
        findOneFailure: (id: number) => string;
        updateSuccess: (id: number) => string;
        updateFailure: (id: number) => string;
        removeSuccess: (id: number) => string;
        removeFailure: (id: number) => string;
    };
    sheet: {
        createSuccess: string;
        createFailure: string;
        findAllSuccess: string;
        findAllFailure: string;
        findOneSuccess: (id: number) => string;
        findOneFailure: (id: number) => string;
        updateSuccess: (id: number) => string;
        updateFailure: (id: number) => string;
        removeSuccess: (id: number) => string;
        removeFailure: (id: number) => string;
        uploadSuccess: string;
        uploadFailure: string;
        updateBulkSuccess: string;
        updateBulkFailure: string;
    };
    transaction: {
        createSuccess: string;
        createFailure: string;
        findAllSuccess: string;
        findAllFailure: string;
        findOneSuccess: (id: number) => string;
        findPastTransactionSuccess: (id: number) => string;
        findOneFailure: (id: number) => string;
        updateSuccess: (id: number) => string;
        updateFailure: (id: number) => string;
        removeSuccess: (id: number) => string;
        removeFailure: (id: number) => string;
    };
    vehicleType: {
        createFailure: string;
        fetchFailure: string;
        updateFailure: string;
        deleteFailure: string;
    };
    aggregator: {
        createFailure: string;
        fetchFailure: string;
        updateFailure: string;
        deleteFailure: string;
    };
    model: {
        createFailure: string;
        fetchFailure: string;
        updateFailure: string;
        deleteFailure: string;
    };
    ownedBy: {
        createFailure: string;
        fetchFailure: string;
        updateFailure: string;
        deleteFailure: string;
    };
};
