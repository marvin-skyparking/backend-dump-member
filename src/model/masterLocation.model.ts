import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import MasterLocationPrice from './masterLocationPrice.model';

// Define the interface for the model attributes
export interface MasterLocationAttributes {
  id: number;
  locationCode: string;
  locationName: string;
  quotaMobil: number;
  quotaMotor: number;
  cardMobilQuota: number;
  cardMotorQuota: number;
  QuotaMotorRemaining: number; // New field
  QuotaMobilRemaining: number; // New field
  cardMobilRemaining: number; // New field
  cardMotorRemaining: number; // New field
  virtualAccount: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdOn?: Date;
  updatedOn?: Date;
  DeleteOn?: Date;
  initialLocation: string;
}

// Define the creation attributes (optional fields)
export interface MasterLocationCreationAttributes
  extends Optional<
    MasterLocationAttributes,
    'id' | 'createdOn' | 'updatedOn' | 'DeleteOn'
  > {}

// Define the MasterLocation model
class MasterLocation
  extends Model<MasterLocationAttributes, MasterLocationCreationAttributes>
  implements MasterLocationAttributes
{
  public id!: number;
  public locationCode!: string;
  public locationName!: string;
  public quotaMobil!: number;
  public quotaMotor!: number;
  public cardMobilQuota!: number;
  public cardMotorQuota!: number;
  public QuotaMotorRemaining!: number; // New field
  public QuotaMobilRemaining!: number; // New field
  public cardMobilRemaining!: number; // New field
  public cardMotorRemaining!: number; // New field
  public virtualAccount!: string;
  public createdBy?: string;
  public updatedBy?: string;
  public deletedBy?: string;
  public createdOn?: Date;
  public updatedOn?: Date;
  public DeleteOn?: Date;
  public initialLocation!: string;

  // Initialize the MasterLocation model
  public static initModel() {
    MasterLocation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        locationCode: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true // Add unique constraint
        },
        locationName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        quotaMobil: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        quotaMotor: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        cardMobilQuota: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        cardMotorQuota: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        QuotaMotorRemaining: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        QuotaMobilRemaining: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        cardMobilRemaining: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        cardMotorRemaining: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        virtualAccount: {
          type: DataTypes.STRING,
          allowNull: false
        },
        createdBy: {
          type: DataTypes.STRING,
          allowNull: true
        },
        updatedBy: {
          type: DataTypes.STRING,
          allowNull: true
        },
        deletedBy: {
          type: DataTypes.STRING,
          allowNull: true
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW
        },
        updatedOn: {
          type: DataTypes.DATE,
          allowNull: true
        },
        DeleteOn: {
          type: DataTypes.DATE,
          allowNull: true
        },
        initialLocation: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true // Add unique constraint
        }
      },
      {
        sequelize,
        tableName: 'MasterLocations',
        timestamps: false // Set to true if you use createdAt/updatedAt fields
      }
    );

    // Set up associations here
    MasterLocation.hasMany(MasterLocationPrice, {
      foreignKey: 'locationId', // Ensure this matches the foreign key
      sourceKey: 'id', // This should match the primary key of MasterLocation
      as: 'prices'
    });
  }
}

// Call the method to initialize the model
MasterLocation.initModel();
export default MasterLocation;
