import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define enums
export enum MembershipStatus {
  NEW = 'new',
  EXTEND = 'extend',
  ISMEMBER = 'ismember'
}

export enum VehicleType {
  MOBIL = 'MOBIL',
  MOTOR = 'MOTOR'
}

// Define attributes interface
export interface TransactionHistoryAttributes {
  id?: number;
  fullname: string;
  phonenumber: string;
  membershipStatus: MembershipStatus;
  vehicletype: VehicleType;
  NoCard: string;
  PlateNumber: string;
  licensePlate?: string | null;
  stnk?: string | null;
  paymentFile?: string | null;
  locationCode: string;
  NoRef?: string | null;
  isActive: boolean;
  createdBy?: string;
  approvedBy?: string;
  deletedOn?: Date;
  deletedBy?: string;
  paidAmount?: number;
  noRek: string; // New field
  namaRek: string; // New field
  createdAt?: Date;
  updatedAt?: Date;
  isBayar?: Boolean;
}

// Define creation attributes interface
export interface TransactionHistoryCreationAttributes
  extends Optional<
    TransactionHistoryAttributes,
    'id' | 'createdAt' | 'updatedAt'
  > {}

class TransactionHistory
  extends Model<
    TransactionHistoryAttributes,
    TransactionHistoryCreationAttributes
  >
  implements TransactionHistoryAttributes
{
  public id!: number;
  public fullname!: string;
  public phonenumber!: string;
  public paidAmount?: number;
  public membershipStatus!: MembershipStatus;
  public vehicletype!: VehicleType;
  public NoCard!: string;
  public PlateNumber!: string;
  public licensePlate?: string;
  public stnk?: string;
  public paymentFile?: string;
  public locationCode!: string;
  public NoRef?: string | null; // Optional NoRef field
  public isActive!: boolean;
  public createdBy?: string;
  public approvedBy?: string;
  public deletedOn?: Date;
  public deletedBy?: string;
  public isBayar?: Boolean | undefined;
  public noRek!: string; // New field
  public namaRek!: string; // New field

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the TransactionHistory model with column definitions and options
TransactionHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    membershipStatus: {
      type: DataTypes.ENUM,
      values: Object.values(MembershipStatus),
      allowNull: false
    },
    vehicletype: {
      type: DataTypes.ENUM,
      values: Object.values(VehicleType),
      allowNull: false
    },
    NoCard: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PlateNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stnk: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentFile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    locationCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    NoRef: {
      type: DataTypes.STRING,
      allowNull: true // NoRef is optional
    },
    paidAmount: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isBayar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deletedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    noRek: {
      type: DataTypes.STRING,
      allowNull: false // Not allowed to be null
    },
    namaRek: {
      type: DataTypes.STRING,
      allowNull: false // Not allowed to be null
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'transactions_dump_history',
    timestamps: true
  }
);

export default TransactionHistory;
