import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the interface for the model attributes
export interface dumpDataPayload {
  id?: number;
  nama: string;
  noPolisi: string;
  idProdukPass: string;
  Payment?: string;
  CodeProduct?: string;
  TGL_AKHIR: Date;
  idGrup: string;
  FAKTIF: number;
  FUPDATE: number;
  NoKartu?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (optional fields)
interface dumpDataCreationAttributes extends Optional<dumpDataPayload, 'id'> {}

// Define the model class
class dumpDataMember
  extends Model<dumpDataPayload, dumpDataCreationAttributes>
  implements dumpDataPayload
{
  public id!: number;
  public nama!: string;
  public noPolisi!: string;
  public idProdukPass!: string;
  public Payment!: string;
  public CodeProduct?: string;
  public TGL_AKHIR!: Date;
  public idGrup!: string;
  public FAKTIF!: number;
  public FUPDATE!: number;
  public NoKartu?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

// Initialize the model
dumpDataMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noPolisi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idProdukPass: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Payment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CodeProduct: {
      type: DataTypes.STRING,
      allowNull: true
    },
    TGL_AKHIR: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idGrup: {
      type: DataTypes.STRING,
      allowNull: false
    },
    FAKTIF: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    FUPDATE: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    NoKartu: {
      type: DataTypes.STRING,
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
    tableName: 'dumpCustMember', // Replace with your actual table name
    timestamps: true // Set to true if you use createdAt/updatedAt fields
  }
);

// Export the model
export default dumpDataMember;
