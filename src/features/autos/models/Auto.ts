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
  estado: EstadoAuto;
  precio: number;
  descripcion: string;
  imagenUrl?: string;
  imagenUrlCompleta?: string;
  ultimoServicio?: Date;
  caracteristicas: string[];
  createdAt?: Date;
  updatedAt?: Date;
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
  public estado!: EstadoAuto;
  public precio!: number;
  public descripcion!: string;
  public imagenUrl!: string;
  public ultimoServicio!: Date;
  public caracteristicas!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  private getBaseUrl(): string {
    return process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  }

  public get imagenUrlCompleta(): string {
    return this.imagenUrl ? `${this.getBaseUrl()}/${this.imagenUrl}` : '';
  }

  public toJSON(): AutoAttributes {
    const values = super.toJSON() as AutoAttributes;
    values.imagenUrlCompleta = this.imagenUrlCompleta;
    
    // Asegurarse de que las características se deserialicen correctamente
    if (typeof values.caracteristicas === 'string') {
      try {
        values.caracteristicas = JSON.parse(values.caracteristicas);
      } catch (e) {
        values.caracteristicas = [];
      }
    }
    
    // Definir el orden específico de los campos
    return {
      id: values.id,
      nombre: values.nombre,
      marca: values.marca,
      modelo: values.modelo,
      anio: values.anio,
      tipoCarroceria: values.tipoCarroceria,
      color: values.color,
      placas: values.placas,
      estado: values.estado,
      precio: values.precio,
      descripcion: values.descripcion,
      imagenUrl: values.imagenUrl,
      imagenUrlCompleta: values.imagenUrlCompleta,
      ultimoServicio: values.ultimoServicio,
      caracteristicas: values.caracteristicas,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt
    };
  }
}

export const TIPOS_CARROCERIA = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'coupe', 'wagon', 'convertible', 'truck'] as const;
export type TipoCarroceria = typeof TIPOS_CARROCERIA[number];

export const ESTADOS_AUTO = ['disponible', 'mantenimiento', 'vendido'] as const;
export type EstadoAuto = typeof ESTADOS_AUTO[number];

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
      type: DataTypes.ENUM(...ESTADOS_AUTO),
      allowNull: false,
      defaultValue: 'disponible',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
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
      get() {
        const rawValue = this.getDataValue('caracteristicas');
        if (typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return [];
          }
        }
        return rawValue;
      },
      set(value: string[]) {
        if (Array.isArray(value)) {
          this.setDataValue('caracteristicas', value);
        } else if (typeof value === 'string') {
          try {
            this.setDataValue('caracteristicas', JSON.parse(value));
          } catch (e) {
            this.setDataValue('caracteristicas', []);
          }
        } else {
          this.setDataValue('caracteristicas', []);
        }
      },
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
    modelName: 'Auto'
  }
);

export default Auto; 