import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import fs from 'fs';
import path from 'path';
import logger from '../../../core/utils/logger';
import Auto, { AutoAttributes } from '../models/Auto';

class AutoController {
  async obtenerTodos(req: Request, res: Response) {
    try {
      const autos = await Auto.findAll();
      res.json(autos);
    } catch (error) {
      logger.error('Error al obtener los autos:', error);
      res.status(500).json({ error: 'Error al obtener los autos' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const auto = await Auto.findByPk(Number(req.params.id));
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }
      res.json(auto);
    } catch (error) {
      logger.error('Error al obtener el auto:', error);
      res.status(404).json({ error: 'Auto no encontrado' });
    }
  }

  async crear(req: Request, res: Response) {
    try {
      const autoData: Omit<AutoAttributes, 'id'> = req.body;
      
      if (req.file) {
        autoData.imagenUrl = req.file.path.replace(/\\/g, '/');
      }

      const nuevoAuto = await Auto.create(autoData);
      res.status(201).json(nuevoAuto);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ 
          error: 'Ya existe un auto registrado con estas placas',
          detalles: 'Las placas deben ser únicas para cada vehículo'
        });
      }
      logger.error('Error al crear auto:', error);
      res.status(400).json({ 
        error: 'Error al crear el auto', 
        detalles: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const autoData = req.body;

      const auto = await Auto.findByPk(id);
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }

      if (req.file) {
        if (auto.imagenUrl && auto.imagenUrl !== 'uploads/default-car.jpg') {
          const imagePath = path.join(__dirname, '../../../../', auto.imagenUrl);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        autoData.imagenUrl = req.file.path.replace(/\\/g, '/');
      }

      await auto.update(autoData);
      res.json(auto);
    } catch (error) {
      logger.error('Error al actualizar:', error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ 
          error: 'Ya existe un auto registrado con estas placas',
          detalles: 'Las placas deben ser únicas para cada vehículo'
        });
      }
      res.status(500).json({ 
        error: 'Error al actualizar el auto', 
        detalles: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  }

  // Asumiendo que tienes un modelo 'Auto' y un archivo de rutas



  async eliminar(req: Request, res: Response) {
    try {
      const auto = await Auto.findByPk(Number(req.params.id));
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }

      if (auto.imagenUrl && auto.imagenUrl !== 'uploads/default-car.jpg') {
        const imagePath = path.join(__dirname, '../../../../', auto.imagenUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await auto.destroy();
      res.status(200).json({ mensaje: 'Auto eliminado correctamente' }); // ← Aquí el mensaje
    } catch (error) {
      logger.error('Error al eliminar:', error);
      res.status(500).json({ error: 'Error al eliminar el auto' });
    }
  }

  async buscarPorEstado(req: Request, res: Response) {
    try {
      const estado = req.params.estado;
      const autos = await Auto.findAll({
        where: { estado }
      });

      if (!autos || autos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron autos con ese estado' });
      }

      res.json(autos);
    } catch (error) {
      logger.error('Error al buscar por estado:', error);
      res.status(500).json({ error: 'Error al buscar autos por estado' });
    }
  }

  async actualizarUltimoServicio(req: Request, res: Response) {
    try {
      const auto = await Auto.findByPk(Number(req.params.id));
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }

      await auto.update({
        ultimoServicio: new Date()
      });

      res.json(auto);
    } catch (error) {
      logger.error('Error al actualizar servicio:', error);
      res.status(500).json({ error: 'Error al actualizar el servicio del auto' });
    }
  }

  async actualizarImagen(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
      }

      const auto = await Auto.findByPk(Number(req.params.id));
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }

      if (auto.imagenUrl && auto.imagenUrl !== 'uploads/default-car.jpg') {
        const imagePath = path.join(__dirname, '../../../../', auto.imagenUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await auto.update({
        imagenUrl: req.file.path.replace(/\\/g, '/')
      });

      res.json(auto);
    } catch (error) {
      logger.error('Error al actualizar imagen:', error);
      res.status(500).json({ error: 'Error al actualizar la imagen del auto' });
    }
  }

  async actualizarEstado(req: Request, res: Response) {
    try {
      const { estado } = req.body;
      const auto = await Auto.findByPk(Number(req.params.id));
      
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }

      if (!['disponible', 'mantenimiento', 'vendido'].includes(estado)) {
        return res.status(400).json({ 
          error: 'Estado no válido',
          detalles: 'El estado debe ser: disponible, mantenimiento o vendido'
        });
      }

      await auto.update({ estado });
      res.json(auto);
    } catch (error) {
      logger.error('Error al actualizar estado del auto:', error);
      res.status(500).json({ 
        error: 'Error al actualizar el estado del auto',
        detalles: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async obtenerAutosDisponibles(req: Request, res: Response) {
    try {
      const autosDisponibles = await Auto.findAll({
        where: { estado: 'disponible' },
        order: [
          ['top_sales', 'DESC'],
          ['createdAt', 'DESC']
        ]
      });

      if (!autosDisponibles || autosDisponibles.length === 0) {
        return res.status(404).json({ mensaje: 'No hay autos disponibles en este momento' });
      }

      res.json(autosDisponibles);
    } catch (error) {
      logger.error('Error al obtener autos disponibles:', error);
      res.status(500).json({ 
        error: 'Error al obtener los autos disponibles',
        detalles: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async actualizarTopSales(req: Request, res: Response) {
    try {
      const { top_sales } = req.body;
      const auto = await Auto.findByPk(Number(req.params.id));
      
      if (!auto) {
        return res.status(404).json({ error: 'Auto no encontrado' });
      }

      if (typeof top_sales !== 'boolean') {
        return res.status(400).json({ 
          error: 'Valor no válido',
          detalles: 'El campo top_sales debe ser un valor booleano (true/false)'
        });
      }

      await auto.update({ top_sales });
      res.json(auto);
    } catch (error) {
      logger.error('Error al actualizar top_sales del auto:', error);
      res.status(500).json({ 
        error: 'Error al actualizar top_sales del auto',
        detalles: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export default new AutoController(); 