import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger';

export const configureApp = async (app: Application) => {
  // Middlewares básicos
  app.use(cors());
  app.use(helmet());
  
  // Morgan solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  // Configurar express para manejar caracteres especiales
  app.use(express.json());
  app.use(express.urlencoded({ 
    extended: true,
    limit: '50mb',
    parameterLimit: 100000,
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        // Si no es JSON válido, no hay problema
      }
    }
  }));
  
  // Crear y configurar directorios de storage
  const storageDirs = [
    'storage/images/autos',
    'storage/images/thumbnails',
    'storage/temp'
  ];

  storageDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../../', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  
  // Servir archivos estáticos
  const storagePath = path.join(process.cwd(), 'storage');
  app.use('/storage', express.static(storagePath));
  
  // Asegurarse de que existe el directorio de storage
  const imageDir = path.join(storagePath, 'images', 'autos');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Configurar cabeceras CORS específicas si es necesario
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}; 