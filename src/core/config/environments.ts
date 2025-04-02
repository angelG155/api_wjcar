import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno según el ambiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(process.cwd(), envFile) });

interface Config {
  port: number;
  baseUrl: string;
  frontendUrl: string;
  database: {
    host: string;
    user: string;
    password: string;
    name: string;
    port: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  storage: {
    maxFileSize: number;
    allowedMimeTypes: string[];
    uploadDir: string;
    basePath: string;
    publicUrl: string;
  };
  cors: {
    origin: string[];
    methods: string[];
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

// Función auxiliar para construir URLs
const getBaseUrl = () => {
  const port = process.env.PORT || 3000;
  if (process.env.BASE_URL) return process.env.BASE_URL;
  return process.env.NODE_ENV === 'production'
    ? `http://${process.env.HOST || 'localhost'}`
    : `http://localhost:${port}`;
};

const development: Config = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: getBaseUrl(),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'sistema_autos',
    port: 3306
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret',
    expiresIn: '24h'
  },
  storage: {
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadDir: 'storage/images',
    basePath: path.join(process.cwd(), 'storage'),
    publicUrl: '/storage'
  },
  cors: {
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por ventana
  }
};

const production: Config = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: getBaseUrl(),
  frontendUrl: process.env.FRONTEND_URL || 'https://tudominio.com',
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'prod_user',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'sistema_autos_prod',
    port: 3306
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: '12h'
  },
  storage: {
    maxFileSize: 2 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadDir: 'storage/images',
    basePath: path.join(process.cwd(), 'storage'),
    publicUrl: '/storage'
  },
  cors: {
    origin: (process.env.FRONTEND_URL || 'https://tudominio.com').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 60 // límite más estricto en producción
  }
};

const config: Config = process.env.NODE_ENV === 'production' ? production : development;

// Validar configuración crítica en producción
if (process.env.NODE_ENV === 'production') {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET debe estar configurado en producción');
  }
  if (!config.database.password) {
    throw new Error('DB_PASSWORD debe estar configurado en producción');
  }
}

export default config; 