import { Request, Response, NextFunction } from 'express';
import logger from '../core/utils/logger';

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