import express from 'express';
import dotenv from 'dotenv';
import { configureApp } from './core/config/app';
import sequelize from './core/config/database';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import logger from './core/utils/logger';

// Configuración de variables de entorno
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Configurar la aplicación
  await configureApp(app);

  // Rutas
  app.use('/api', routes);

  // Manejador de errores
  app.use(errorHandler);

  // Sincronización con la base de datos
  const forceSync = process.env.FORCE_SYNC === 'true';
  logger.info(`Sincronización de base de datos con force=${forceSync}`);

  try {
    await sequelize.sync({
      force: forceSync,
      alter: !forceSync//! Alteracion de la bd, sin borrar los datos
    });
    logger.info('Base de datos sincronizada');
    
    if (forceSync) {
      logger.info('ADVERTENCIA: La base de datos ha sido reiniciada (force: true)');
    }

    // Iniciar el servidor
    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer(); 