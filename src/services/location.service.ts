import { IPaginatePayload } from "../interfaces/pagination.interface";
import MasterLocation,{MasterLocationAttributes, MasterLocationCreationAttributes} from "../model/masterLocation.model";
import { Op } from 'sequelize';

// Create a new master location
export async function createMasterLocation(data: MasterLocationCreationAttributes): Promise<MasterLocation> {
    try {
        const masterLocation = await MasterLocation.create(data);
        return masterLocation;
    } catch (error: any) {
        console.error('Error creating master location:', error);
        throw new Error(error.message || 'Failed to create master location');
    }
}

// Get a master location by ID
export async function getMasterLocationById(id: number): Promise<MasterLocation | null> {
    try {
        return await MasterLocation.findByPk(id);
    } catch (error: any) {
        console.error('Error fetching master location by ID:', error);
        throw new Error(error.message || 'Failed to fetch master location');
    }
}

// Get all master locations
export async function getAllMasterLocations(payload: IPaginatePayload = {}): Promise<{ rows: MasterLocation[], count: number }> {
    try {
        const { page = 1, limit = 10, search = '' } = payload;

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Build search condition using LIKE
        const searchCondition = search ? {
            [Op.or]: [
                { locationCode: { [Op.like]: `%${search}%` } },
                { locationName: { [Op.like]: `%${search}%` } },
                { virtualAccount: { [Op.like]: `%${search}%` } },
            ]
        } : {};

        // Fetch master locations with pagination and search
        const { count, rows } = await MasterLocation.findAndCountAll({
            where: searchCondition,
            limit,
            offset,
        });

        return { rows, count };
    } catch (error: any) {
        console.error('Error fetching master locations:', error);
        throw new Error(error.message || 'Failed to fetch master locations');
    }
}

// Update an existing master location
export async function updateMasterLocation(id: number, data: MasterLocationAttributes): Promise<MasterLocation> {
    try {
        const masterLocation = await MasterLocation.findByPk(id);
        if (!masterLocation) {
            throw new Error('Master Location not found');
        }
        await masterLocation.update(data);
        return masterLocation;
    } catch (error: any) {
        console.error('Error updating master location:', error);
        throw new Error(error.message || 'Failed to update master location');
    }
}

// Delete a master location by ID
export async function deleteMasterLocation(id: number): Promise<void> {
    try {
        const masterLocation = await MasterLocation.findByPk(id);
        if (!masterLocation) {
            throw new Error('Master Location not found');
        }
        await masterLocation.destroy();
    } catch (error: any) {
        console.error('Error deleting master location:', error);
        throw new Error(error.message || 'Failed to delete master location');
    }
}
