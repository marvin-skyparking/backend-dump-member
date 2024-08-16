import { Request, Response } from 'express';
import * as MasterLocationService from '../services/location.service'; // Adjust the path as necessary
import { MasterLocationAttributes, MasterLocationCreationAttributes } from '../model/masterLocation.model';
import { NotFound, OK, ServerError } from '../utils/response/common.response';
import { IPaginatePayload } from '../interfaces/pagination.interface';


// Create a new master location
export async function createMasterLocation(req: Request, res: Response): Promise<Response> {
    try {
        const data: MasterLocationCreationAttributes = req.body;
        const masterLocation = await MasterLocationService.createMasterLocation(data);

        return OK(res, 'Data Location Created Successfully', masterLocation);
        
    } catch (error: any) {
        return ServerError(req, res, error?.message || 'Failed to create Location', error);
    }
}

// Get a master location by ID
export async function getMasterLocationById(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id, 10);
        const masterLocation = await MasterLocationService.getMasterLocationById(id);
        if (!masterLocation) {

            return NotFound(res, 'Location not found');
        }

        return OK(res, 'Get Data Location Successfully', masterLocation);

    } catch (error: any) {

        return ServerError(req, res, error?.message || 'Failed to fetch Location', error);
    }
}

// Get all master locations
export async function getAllMasterLocations(req: Request, res: Response): Promise<Response> {
    try {
        // Extract pagination and search parameters from the query
        const { page, limit, search } = req.query;

        // Prepare the payload for the service
        const payload: IPaginatePayload = {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
            search: search as string || '',
        };

        // Fetch master locations with pagination and search
        const { rows: masterLocations, count } = await MasterLocationService.getAllMasterLocations(payload);

        // Prepare the response data with pagination info
        const responseData = {
            totalItems: count,
            totalPages: Math.ceil(count / (payload.limit ?? 10)),
            currentPage: payload.page,
            items: masterLocations,
        };

        return OK(res, 'Get Data Location Successfully', responseData);
        
    } catch (error: any) {
        return ServerError(req, res, error?.message || 'Failed to fetch Location', error);
    }
}

// Update an existing master location
export async function updateMasterLocation(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id, 10);
        const data: MasterLocationAttributes = req.body;
        const updatedMasterLocation = await MasterLocationService.updateMasterLocation(id, data);
        return OK(res, 'Update Data Location Successfully', updatedMasterLocation);
        
    } catch (error: any) {
        return ServerError(req, res, error?.message || 'Failed to update Location', error);
    }
}

// Delete a master location by ID
export async function deleteMasterLocation(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id, 10);
        await MasterLocationService.deleteMasterLocation(id);

        return OK(res, 'Delete Data Location Successfully');
        
    } catch (error: any) {
        return ServerError(req, res, error?.message || 'Failed to delete Location', error);
    }
}
