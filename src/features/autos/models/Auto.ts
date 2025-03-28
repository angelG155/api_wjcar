import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../core/config/database';

export interface AutoAttributes {
  id?: number;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoCarroceria: string;
  color: string;
  placas: string;
  estado: string;
  precio: number;
  imagenUrl?: string;
  ultimoServicio?: Date;
  caracteristicas: string[];
}

class Auto extends Model<AutoAttributes> implements AutoAttributes {
  public id!: number;
  public nombre!: string;
  public marca!: string;
  public modelo!: string;
  public anio!: number;
  public tipoCarroceria!: string;
  public color!: string;
  public placas!: string;
  public estado!: string;
  public precio!: number;
  public imagenUrl!: string;
  public ultimoServicio!: Date;
  public caracteristicas!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
const TIPOS_CARROCERIA = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'coupe', 'wagon', 'convertible', 'truck'];

Auto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoCarroceria: {
      type: DataTypes.ENUM(...TIPOS_CARROCERIA),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placas: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'storage/images/autos/default-car.jpg',
    },
    ultimoServicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    caracteristicas: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        esArray(value: any) {
          if (!Array.isArray(value)) {
            throw new Error('El campo "caracteristicas" debe ser un arreglo');
          }
        }
      }
    }
    
  },
  {
    sequelize,
    modelName: 'Auto',
  }
);

export default Auto; 