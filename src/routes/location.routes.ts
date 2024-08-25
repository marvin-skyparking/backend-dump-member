import { Router } from 'express';
import {
  createMasterLocation,
  getMasterLocationById,
  getAllMasterLocations,
  updateMasterLocation,
  deleteMasterLocation,
  getAllCustomerLocations
} from '../controller/location.controller'; // Adjust the path as necessary

const locationRoute = Router();

// Route to create a new master location
locationRoute.post('/master-locations', createMasterLocation);

// Route to get a master location by ID
locationRoute.get('/master-locations/:id', getMasterLocationById);

// Route to get all master locations
locationRoute.get('/allmaster-locations', getAllMasterLocations);
locationRoute.get('/allcustomer-locations', getAllCustomerLocations);

// Route to update an existing master location
locationRoute.put('/master-locations/:id', updateMasterLocation);

// Route to delete a master location by ID
locationRoute.delete('/master-locations/:id', deleteMasterLocation);

export default locationRoute;
