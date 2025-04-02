import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Formato personalizado para desarrollo
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
  }
  return msg;
});

// Configuración de transports según el ambiente
const transports: winston.transport[] = [];


  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        devFormat
      )
    })
  );


// Crear el logger base
const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports,
  // Manejo de excepciones y rechazos no capturados
  handleExceptions: true,
  handleRejections: true,
  // Evitar que el proceso termine en caso de error
  exitOnError: false
});

// Función para limpiar datos sensibles
const cleanSensitiveData = (data: any): any => {
  if (!data) return data;
  
  const sensitiveFields = ['password', 'token', 'secret', 'credit_card'];
  const cleaned = { ...data };

  sensitiveFields.forEach(field => {
    if (field in cleaned) {
      cleaned[field] = '[REDACTED]';
    }
  });

  return cleaned;
};

class Logger {
  info(message: string, ...args: any[]) {
    const meta = args.length > 0 ? cleanSensitiveData(args) : undefined;
    winstonLogger.info(message, meta);
  }

  error(message: string, error?: any) {
    const meta = error ? cleanSensitiveData(error) : undefined;
    winstonLogger.error(message, meta);
  }

  debug(message: string, ...args: any[]) {
    const meta = args.length > 0 ? cleanSensitiveData(args) : undefined;
    winstonLogger.debug(message, meta);
  }

  warn(message: string, ...args: any[]) {
    const meta = args.length > 0 ? cleanSensitiveData(args) : undefined;
    winstonLogger.warn(message, meta);
  }
}

export default new Logger(); 