import express from 'express';
import * as locationPriceController from '../controller/priceLocation.controller';

const priceLocation = express.Router();

// Create a new location price
priceLocation.post(
  '/location-prices',
  locationPriceController.createLocationPriceController
);

// Get all location prices
priceLocation.get(
  '/location-prices',
  locationPriceController.getAllLocationPricesController
);

// Get a location price by locationId (assuming this is the primary key)
priceLocation.get(
  '/location-prices/:locationId',
  locationPriceController.getLocationPriceController
);

// Update a location price by locationId
priceLocation.put(
  '/location-prices/:locationId',
  locationPriceController.updateLocationPriceController
);

// Delete a location price by locationId
priceLocation.delete(
  '/location-prices/:locationId',
  locationPriceController.deleteLocationPriceController
);

export default priceLocation;
