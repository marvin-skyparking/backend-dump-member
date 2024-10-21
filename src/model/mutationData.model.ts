import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MutationDataAttributes {
  id: number;
  description?: string;
  dateinsert?: Date;
  nominal?: number;
  isConfirmed?: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MutationDataCreationAttributes
  extends Optional<MutationDataAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MutationData
  extends Model<MutationDataAttributes, MutationDataCreationAttributes>
  implements MutationDataAttributes
{
  public id!: number;
  public description?: string;
  public dateinsert?: Date;
  public nominal?: number;
  public isConfirmed?: Boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

MutationData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateinsert: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: 'CASCADE' // Use one of the allowed string values
    }
  },
  {
    sequelize,
    modelName: 'MutationData',
    tableName: 'mutationData',
    timestamps: true
  }
);

export default MutationData;
