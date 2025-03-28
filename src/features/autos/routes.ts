import { Router } from 'express';
import autoController from './controllers/autoController';
import upload from '../../middlewares/uploadMiddleware';
import { validateAuto, validarId, validarEstado } from './validations/autoValidations';

const router = Router();

// Obtener todos los autos
router.get('/', autoController.obtenerTodos);

// Obtener solo autos disponibles
router.get('/disponibles', autoController.obtenerAutosDisponibles);

// Obtener un auto por ID
router.get('/:id', validarId, autoController.obtenerPorId);

// Crear un nuevo auto
router.post('/', upload.single('imagen'), validateAuto, autoController.crear);

// Actualizar un auto
router.put('/:id', validarId, upload.single('imagen'), validateAuto, autoController.actualizar);

// Eliminar un auto
router.delete('/:id', validarId, autoController.eliminar);

// Buscar autos por estado
router.get('/estado/:estado', validarEstado, autoController.buscarPorEstado);

// Actualizar último servicio
router.patch('/:id/servicio', validarId, autoController.actualizarUltimoServicio);

// Actualizar solo la imagen
router.patch('/:id/imagen', validarId, upload.single('imagen'), autoController.actualizarImagen);

// Actualizar estado del auto
router.patch('/:id/estado', validarId, autoController.actualizarEstado);

export default router; 