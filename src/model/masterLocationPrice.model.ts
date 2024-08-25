import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import MasterLocation from './masterLocation.model'; // Ensure this import is correct

interface MasterLocationPriceAttributes {
  id: number; // Primary key for MasterLocationPrice
  locationId: number; // Foreign key referencing MasterLocation
  priceMotor: number; // Price for motor vehicles
  priceMobil: number; // Price for mobil vehicles
}

// Define the interface for the creation of new records (optional fields)
interface MasterLocationPriceCreationAttributes
  extends Optional<MasterLocationPriceAttributes, 'id'> {}

// Define the MasterLocationPrice model
class MasterLocationPrice extends Model<
  MasterLocationPriceAttributes,
  MasterLocationPriceCreationAttributes
> {
  public id!: number; // Primary key
  public locationId!: number; // Foreign key to MasterLocation
  public priceMotor!: number; // Price for motor vehicles
  public priceMobil!: number; // Price for mobil vehicles

  // Define the association here
  public static associate(models: any) {
    MasterLocationPrice.belongsTo(models.MasterLocation, {
      foreignKey: 'locationId', // Foreign key in this model
      as: 'location' // Alias for the relationship
    });
  }
}

// Initialize the MasterLocationPrice model
MasterLocationPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true // Set id as the primary key
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MasterLocation, // Reference to the MasterLocation model
        key: 'id' // Primary key in MasterLocation
      }
    },
    priceMotor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    priceMobil: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: 'MasterLocationPrices',
    sequelize, // Pass the `sequelize` instance
    timestamps: true, // Enable timestamps if needed
    createdAt: 'createdAt', // Customize createdAt field
    updatedAt: 'updatedAt' // Customize updatedAt field
  }
);

export default MasterLocationPrice;
