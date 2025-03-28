import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../../../core/utils/logger';

const autoValidationSchema = Joi.object({
  nombre: Joi.string().required(),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  anio: Joi.number().required(),
  tipoCarroceria: Joi.string().required(),
  color: Joi.string().required(),
  placas: Joi.string().required(),
  estado: Joi.string().required(),
  precio: Joi.number().required(),
  descripcion: Joi.string().required().min(10).max(500),
  imagenUrl: Joi.string().allow(null, ''),
  ultimoServicio: Joi.date().allow(null),
  caracteristicas: Joi.array().items(Joi.string()).required()
});

export const validateAuto = (req: Request, res: Response, next: NextFunction) => {
  const { error } = autoValidationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};

export const validarId = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
};

export const validarEstado = (req: Request, res: Response, next: NextFunction) => {
  const estado = req.params.estado;
  if (!estado) {
    return res.status(400).json({ error: 'Estado requerido' });
  }
  next();
}; 