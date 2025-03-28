const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  info(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  }

  error(message: string, error?: any) {
    if (isDevelopment) {
      console.error(message, error);
    }
  }

  debug(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  }
}

export default new Logger(); 