import { IPaginatePayload } from '../interfaces/pagination.interface';
import MasterLocation, {
  MasterLocationAttributes,
  MasterLocationCreationAttributes
} from '../model/masterLocation.model';
import { Op } from 'sequelize';
import MasterLocationPrice from '../model/masterLocationPrice.model';

// Create a new master location
export async function createMasterLocation(
  data: MasterLocationCreationAttributes
): Promise<MasterLocation> {
  try {
    // Check if locationCode or initialLocation already exists
    const existingLocation = await MasterLocation.findOne({
      where: {
        [Op.or]: [
          { locationCode: data.locationCode },
          { initialLocation: data.initialLocation }
        ]
      }
    });

    if (existingLocation) {
      throw new Error('LocationCode or InitialLocation already exists.');
    }

    // Create the new MasterLocation
    return await MasterLocation.create(data);
  } catch (error) {
    console.error('Error creating master location:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create master location'
    );
  }
}

// Get a master location by ID
export async function getMasterLocationById(
  id: number
): Promise<MasterLocation | null> {
  try {
    return await MasterLocation.findByPk(id);
  } catch (error) {
    console.error('Error fetching master location by ID:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch master location'
    );
  }
}

// Get a master location by locationCode
export async function getMasterLocationByCode(
  locationCode: string
): Promise<MasterLocation | null> {
  try {
    return await MasterLocation.findOne({ where: { locationCode } });
  } catch (error) {
    console.error('Error fetching master location by code:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch master location'
    );
  }
}

// Get all master locations
export async function getAllMasterLocations(
  payload: IPaginatePayload = {}
): Promise<{ rows: MasterLocation[]; count: number }> {
  try {
    const { page = 1, limit = 10, search = '' } = payload;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build search condition using LIKE
    const searchCondition = search
      ? {
          [Op.or]: [
            { locationCode: { [Op.like]: `%${search}%` } },
            { locationName: { [Op.like]: `%${search}%` } },
            { virtualAccount: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    // Fetch master locations with pagination and search
    const { count, rows } = await MasterLocation.findAndCountAll({
      where: searchCondition,
      limit,
      offset
    });

    return { rows, count };
  } catch (error) {
    console.error('Error fetching master locations:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch master locations'
    );
  }
}

// Get all customer locations
export async function getAllCustomerLocations(
  payload: IPaginatePayload = {}
): Promise<{ rows: MasterLocation[]; count: number }> {
  try {
    const { page = 1, limit = 10, search = '' } = payload;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build search condition using LIKE
    const searchCondition = search
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { locationCode: { [Op.like]: `%${search}%` } },
                { locationName: { [Op.like]: `%${search}%` } },
                { virtualAccount: { [Op.like]: `%${search}%` } }
              ]
            },
            { isActive: true } // Ensure only active locations are returned
          ]
        }
      : { isActive: true }; // Default condition if no search term is provided

    // Fetch master locations with pagination, search, and associated prices
    const { count, rows } = await MasterLocation.findAndCountAll({
      where: searchCondition,
      limit,
      offset,
      include: [
        {
          model: MasterLocationPrice,
          as: 'prices', // Alias used in the association
          required: false // Set to true if you want only locations with prices
        }
      ]
    });

    return { rows, count };
  } catch (error) {
    console.error('Error fetching customer locations:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch customer locations'
    );
  }
}

// Update an existing master location
export async function updateMasterLocation(
  id: number,
  data: MasterLocationAttributes
): Promise<MasterLocation> {
  try {
    const masterLocation = await MasterLocation.findByPk(id);
    if (!masterLocation) {
      throw new Error('Master Location not found');
    }
    await masterLocation.update(data);
    return masterLocation;
  } catch (error) {
    console.error('Error updating master location:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to update master location'
    );
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
  } catch (error) {
    console.error('Error deleting master location:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to delete master location'
    );
  }
}
