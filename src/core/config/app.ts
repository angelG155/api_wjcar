import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import config from './environments';
import logger from '../../utils/logger';

export const configureApp = async (app: Application) => {
  // Configuración de seguridad con Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', '*'],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // Configuración de CORS
  app.use(cors({
    origin: config.cors.origin,
    methods: config.cors.methods,
    credentials: true,
    maxAge: 86400 // 24 horas
  }));

  // Límite de tasa de peticiones
  /* app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { error: 'Demasiadas peticiones, por favor intente más tarde' }
  })); */

  // Compresión de respuestas
  app.use(compression({
    level: Number(process.env.COMPRESSION_LEVEL) || 6,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    }
  }));

  // Configuración de body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ 
    extended: true,
    limit: '10mb'
  }));

  // Logging con Morgan
  if (process.env.NODE_ENV === 'production') {
    const accessLogStream = fs.createWriteStream(
      path.join(process.cwd(), 'logs', 'access.log'),
      { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
  } else {
    app.use(morgan('dev'));
  }

  // Crear directorios necesarios
  const dirs = [
    path.join(process.cwd(), 'logs'),
    path.join(process.cwd(), config.storage.uploadDir)
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Servir archivos estáticos con cache
  app.use(config.storage.publicUrl, express.static(config.storage.basePath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));

 
  // Middleware de seguridad adicional
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-XSS-Protection', '1; mode=block');
    next();
  });

  

  logger.info('Aplicación configurada correctamente');
}; 