import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../core/utils/logger';

const autoSchema = Joi.object({
  nombre: Joi.string().required(),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  anio: Joi.number().required(),
  color: Joi.string().required(),
  placas: Joi.string().required(),
  estado: Joi.string().required(),
  precio: Joi.number().required(),
  imagenUrl: Joi.string().allow(null, ''),
  ultimoServicio: Joi.date().allow(null)
}).unknown(false);

export const validarAuto = (req: Request, res: Response, next: NextFunction) => {
  const datos = { ...req.body };
  logger.debug('Datos recibidos:', datos);

  // Convertir campos numéricos si vienen como string
  if (typeof datos.anio === 'string') {
    datos.anio = Number(datos.anio);
  }
  if (typeof datos.precio === 'string') {
    datos.precio = Number(datos.precio);
  }

  const { error, value } = autoSchema.validate(datos, { 
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errores = error.details.map(err => ({
      campo: err.path[0],
      mensaje: err.message
    }));
    logger.debug('Errores de validación:', errores);
    return res.status(400).json({ errores });
  }

  logger.debug('Datos validados correctamente:', value);
  req.body = value;
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