import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Sequelize } from 'sequelize-typescript';

// Define the interface for the model attributes
export interface MasterLocationAttributes {
    id: number;
    locationCode: string;
    locationName: string;
    quotaMobil: number;
    quotaMotor: number;
    cardMobilQuota: number;
    cardMotorQuota: number;
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
    extends Optional<MasterLocationAttributes, 'id' | 'createdOn' | 'updatedOn' | 'DeleteOn'> {}

// Define the MasterLocation model
class MasterLocation extends Model<MasterLocationAttributes, MasterLocationCreationAttributes>
    implements MasterLocationAttributes {
    public id!: number;
    public locationCode!: string;
    public locationName!: string;
    public quotaMobil!: number;
    public quotaMotor!: number;
    public cardMobilQuota!: number;
    public cardMotorQuota!: number;
    public virtualAccount!: string;
    public createdBy?: string;
    public updatedBy?: string;
    public deletedBy?: string;
    public createdOn?: Date;
    public updatedOn?: Date;
    public DeleteOn?: Date;
    public initialLocation!: string;
}

// Initialize the MasterLocation model
MasterLocation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    locationCode: {
        type: DataTypes.STRING,
        allowNull: false
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
        defaultValue: DataTypes.NOW,
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
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'MasterLocations',
    timestamps: false // Set to true if you use createdAt/updatedAt fields
});

// Export the model
export default MasterLocation;
