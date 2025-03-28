import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

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
  app.use('/storage', express.static(path.join(__dirname, '../../../storage')));
}; 