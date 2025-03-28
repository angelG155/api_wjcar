import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger';

export const configureApp = async (app: Application) => {
  // Configuración de CORS
  app.use(cors({
    origin: true, // Permite todas las origenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true
  }));

  // Configuración de Helmet con ajustes para recursos estáticos
  app.use(helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', '*']
      }
    }
  }));
  
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
  app.use('/storage', express.static(storagePath, {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));
  
  // Asegurarse de que existe el directorio de storage
  const imageDir = path.join(storagePath, 'images', 'autos');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
}; 