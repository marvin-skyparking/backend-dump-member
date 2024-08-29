import { Request, Response } from 'express';
import {
  createLocationPrice,
  getAllLocationPrices,
  getLocationPrice,
  updateLocationPrice,
  deleteLocationPrice
} from '../services/priceLocation.service'; // Assuming the service is in the 'services' directory
import { NotFound, OK, ServerError } from '../utils/response/common.response';

// Create a new location price
export async function createLocationPriceController(
  req: Request,
  res: Response
) {
  try {
    const data = req.body;
    const newLocationPrice = await createLocationPrice(data);

    return OK(res, 'Update Data Location Successfully', newLocationPrice);
  } catch (error: any) {
    return ServerError(
      req,
      res,
      error?.message || 'Failed to Create Location',
      error
    );
  }
}

// Get all location prices
export async function getAllLocationPricesController(
  req: Request,
  res: Response
) {
  try {
    const locationPrices = await getAllLocationPrices();
    return OK(res, 'Update Data Location Successfully', locationPrices);
  } catch (error: any) {
    return ServerError(
      req,
      res,
      error?.message || 'Failed to Get Location',
      error
    );
  }
}

// Get a location price by locationId
export async function getLocationPriceController(req: Request, res: Response) {
  try {
    const locationCode = req.params.locationCode;

    const locationPrice = await getLocationPrice(locationCode);
    if (!locationPrice) {
      return NotFound(res, 'Location Not Found');
    }
    return OK(res, 'Get Data Location Successfully', locationPrice);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Update a location price
export async function updateLocationPriceController(
  req: Request,
  res: Response
) {
  try {
    const locationId = Number(req.params.locationId);
    const data = req.body;
    const updated = await updateLocationPrice(locationId, data);
    if (updated === 0) {
      return NotFound(res, 'Location price not found or no changes made.');
    }
    return OK(res, 'Update Data Location Successfully', updated);
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}

// Delete a location price
export async function deleteLocationPriceController(
  req: Request,
  res: Response
) {
  try {
    const locationId = Number(req.params.locationId);
    const deleted = await deleteLocationPrice(locationId);
    if (deleted === 0) {
      return NotFound(res, 'Location price not found or no changes made.');
    }
    return OK(res, 'Delete Data Location Successfully', deleted);
  } catch (error: any) {
    return ServerError(req, res, error?.message, error);
  }
}
