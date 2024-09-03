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

export enum StatusProgress {
  NEW = 'new',
  DONE = 'done',
  TAKE = 'take',
  PROGRESS = 'progress'
}

// Define attributes interface
export interface TransactionAttributes {
  id: number;
  fullname: string;
  phonenumber: string;
  membershipStatus: MembershipStatus;
  email: string;
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
  statusProgress: StatusProgress;
  noRek: string; // New field
  namaRek: string; // New field
  createdAt?: Date;
  updatedAt?: Date;
  isBayar?: Boolean;
}

// Define creation attributes interface
export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public fullname!: string;
  public phonenumber!: string;
  public statusProgress!: StatusProgress;
  public membershipStatus!: MembershipStatus;
  public email!: string;
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

// Initialize the Transaction model with column definitions and options
Transaction.init(
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
    statusProgress: {
      type: DataTypes.ENUM,
      values: Object.values(StatusProgress),
      defaultValue: StatusProgress.NEW,
      allowNull: false
    },
    membershipStatus: {
      type: DataTypes.ENUM,
      values: Object.values(MembershipStatus),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
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
      // New field
      type: DataTypes.STRING,
      allowNull: false // Not allowed to be null
    },
    namaRek: {
      // New field
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
    tableName: 'transactions',
    timestamps: true
  }
);

export default Transaction;
