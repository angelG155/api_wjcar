const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  info(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.log(message, ...args);
    }
    // Aquí podrías agregar logging a un servicio externo en producción
    // Por ejemplo: Sentry, LogRocket, etc.
  }

  error(message: string, error?: any) {
    if (isDevelopment) {
      console.error(message, error);
    }
    // En producción podrías enviar los errores a un servicio de monitoreo
    // Por ejemplo: Sentry, NewRelic, etc.
  }

  debug(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  }
}

export default new Logger(); 