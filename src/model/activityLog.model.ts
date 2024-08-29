import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Transaction from './dataTransaksi.model';

// Define the interface for the model attributes
export interface ActivityLogAttributes {
  id?: number;
  module_name: string;
  finance_approval?: string;
  admin_user?: string;
  admin_stage?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (optional fields)
interface ActivityLogCreationAttributes
  extends Optional<ActivityLogAttributes, 'id'> {}

// Define the model class
class ActivityLog
  extends Model<ActivityLogAttributes, ActivityLogCreationAttributes>
  implements ActivityLogAttributes
{
  public id!: number;
  public module_name!: string;
  public finance_approval!: string;
  public admin_user!: string;
  public admin_stage?: string;
  public status!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

// Initialize the model
ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    module_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    finance_approval: {
      type: DataTypes.STRING,
      allowNull: true
    },
    admin_user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin_stage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'ActivityLog', // Replace with your actual table name
    timestamps: true // Set to true to use createdAt/updatedAt fields
  }
);

// Export the model
export default ActivityLog;
