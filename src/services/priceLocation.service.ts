import MasterLocationPrice from '../model/masterLocationPrice.model';
import MasterLocation from '../model/masterLocation.model';

// Create a new location price
export async function createLocationPrice(data: {
  locationId: number; // Foreign key referencing MasterLocation
  namaProduk: string;
  priceMotor: number;
  priceMobil: number;
}) {
  // Validate the associated location exists
  const existingLocation = await MasterLocation.findByPk(data.locationId);
  if (!existingLocation) {
    throw new Error('Location not found. Cannot create price.');
  }

  // Create and return the new location price
  const newLocationPrice = await MasterLocationPrice.create(data);
  return newLocationPrice;
}

// Get all location prices
export async function getAllLocationPrices() {
  const locationPrices = await MasterLocationPrice.findAll({
    include: [{ model: MasterLocation, as: 'location' }] // Include associated location
  });
  return locationPrices;
}

// Get a location price by locationId
export async function getLocationPrice(locationCode: string) {
  try {
    const locationPrice = await MasterLocationPrice.findOne({
      include: [
        {
          model: MasterLocation,
          as: 'location', // This should match the alias in your association
          where: { locationCode } // Filter by location code
        }
      ]
    });

    if (!locationPrice) {
      throw new Error('Location price not found');
    }

    return locationPrice;
  } catch (error) {
    console.error('Error fetching location price:', error);
    throw error; // Rethrow the error to handle it upstream if necessary
  }
}

// Update a location price
export async function updateLocationPrice(
  locationId: number,
  data: Partial<{
    priceMotor: number;
    priceMobil: number;
  }>
) {
  const [updated] = await MasterLocationPrice.update(data, {
    where: { locationId }
  });

  if (updated === 0) {
    throw new Error('Location price not found or no changes made.');
  }

  return updated;
}

// Delete a location price
export async function deleteLocationPrice(locationId: number) {
  const deleted = await MasterLocationPrice.destroy({
    where: { locationId }
  });

  if (deleted === 0) {
    throw new Error('Location price not found.');
  }

  return deleted;
}
