/**
 * Messages for Employee and Vehicle operations.
 */
export const Messages = {
    // Employee Messages
    employee: {
        createSuccess: 'Employee created successfully',
        createFailure: 'Failed to create employee',
        findAllSuccess: 'Employees retrieved successfully',
        findAllFailure: 'Failed to retrieve employees',
        findOneSuccess: (id: number) => `Employee with id: ${id} retrieved successfully`,
        findOneFailure: (id: number) => `Failed to retrieve employee with id: ${id}`,
        updateSuccess: (id: number) => `Employee with id: ${id} updated successfully`,
        updateFailure: (id: number) => `Failed to update employee with id: ${id}`,
        removeSuccess: (id: number) => `Employee with id: ${id} deleted successfully`,
        removeFailure: (id: number) => `Failed to delete employee with id: ${id}`,
        inactive: (id: number) => `Employee with id: ${id} is inactive`,
        updateBulkSuccess: 'Employees updated successfully',
        updateBulkFailure: 'Failed to update employees',
    },

    // Vehicle Messages
    vehicle: {
        createSuccess: 'Vehicle created successfully',
        createFailure: 'Failed to create vehicle',
        findAllSuccess: 'Vehicles retrieved successfully',
        findAllFailure: 'Failed to retrieve vehicles',
        invalidStatus: 'Invalid status',
        findOneSuccess: (id: string) => `Vehicle with id: ${id} retrieved successfully`,
        findOneFailure: (id: string) => `Failed to retrieve vehicle with id: ${id}`,
        updateSuccess: (id: string) => `Vehicle with id: ${id} updated successfully`,
        updateFailure: (id: string) => `Failed to update vehicle with id: ${id}`,
        removeSuccess: (id: string) => `Vehicle with id: ${id} deleted successfully`,
        removeFailure: (id: string) => `Failed to delete vehicle with id: ${id}`,
        updateBulkSuccess: 'Vehicles updated successfully',
        updateBulkFailure: 'Failed to update vehicles',
        occupied: (id: string) => `Vehicle with ID ${id} is already occupied`,
        available: (id: string) => `Vehicle with ID ${id} is already available`,
    },
    // Location Messages
    location: {
        createSuccess: 'Location created successfully',
        createFailure: 'Failed to create location',
        findAllSuccess: 'Locations retrieved successfully',
        findAllFailure: 'Failed to retrieve locations',
        findOneSuccess: (id: number) => `Location with ID ${id} retrieved successfully`,
        findOneFailure: (id: number) => `Failed to retrieve location with ID ${id}`,
        updateSuccess: (id: number) => `Location with ID ${id} updated successfully`,
        updateFailure: (id: number) => `Failed to update location with ID ${id}`,
        removeSuccess: (id: number) => `Location with ID ${id} removed successfully`,
        removeFailure: (id: number) => `Failed to remove location with ID ${id}`,
    },
    sheet: {
        createSuccess: 'Sheet created successfully',
        createFailure: 'Failed to create sheet',
        findAllSuccess: 'Sheets retrieved successfully',
        findAllFailure: 'Failed to retrieve sheets',
        findOneSuccess: (id: number) => `Sheet with ID ${id} retrieved successfully`,
        findOneFailure: (id: number) => `Failed to retrieve sheet with ID ${id}`,
        updateSuccess: (id: number) => `Sheet with ID ${id} updated successfully`,
        updateFailure: (id: number) => `Failed to update sheet with ID ${id}`,
        removeSuccess: (id: number) => `Sheet with ID ${id} removed successfully`,
        removeFailure: (id: number) => `Failed to remove sheet with ID ${id}`,
        uploadSuccess: 'Sheet uploaded successfully',
        uploadFailure: 'Failed to upload sheet',
        updateBulkSuccess: 'Sheets updated successfully', // New message for bulk update
        updateBulkFailure: 'Failed to update sheets', // New message for bulk update failure
    },
    transaction: {
        createSuccess: 'Transaction created successfully',
        createFailure: 'Failed to create transaction',
        findAllSuccess: 'Transactions retrieved successfully',
        findAllFailure: 'Failed to retrieve transactions',
        findOneSuccess: (id: number) => `Transaction with ID ${id} retrieved successfully`,
        findOneFailure: (id: number) => `Failed to retrieve transaction with ID ${id}`,
        updateSuccess: (id: number) => `Transaction with ID ${id} updated successfully`,
        updateFailure: (id: number) => `Failed to update transaction with ID ${id}`,
        removeSuccess: (id: number) => `Transaction with ID ${id} removed successfully`,
        removeFailure: (id: number) => `Failed to remove transaction with ID ${id}`,
    },

    vehicleType: {
        createFailure: 'Failed to create vehicle type.',
        fetchFailure: 'Failed to fetch vehicle types.',
        updateFailure: 'Failed to update vehicle type.',
        deleteFailure: 'Failed to delete vehicle type.',
    },
    aggregator: {
        createFailure: 'Failed to create aggregator.',
        fetchFailure: 'Failed to fetch aggregators.',
        updateFailure: 'Failed to update aggregator.',
        deleteFailure: 'Failed to delete aggregator.',
    },
    model: {
        createFailure: 'Failed to create model.',
        fetchFailure: 'Failed to fetch models.',
        updateFailure: 'Failed to update model.',
        deleteFailure: 'Failed to delete model.',
    },
    ownedBy: {
        createFailure: 'Failed to create ownership.',
        fetchFailure: 'Failed to fetch ownerships.',
        updateFailure: 'Failed to update ownership.',
        deleteFailure: 'Failed to delete ownership.',
    },
};
