export class StudioLogger {
  static info(module: string, message: string, data?: any) {
    console.log(`[StudioOS::${module}] [INFO] ${message}`, data || '');
  }

  static warn(module: string, message: string, data?: any) {
    console.warn(`[StudioOS::${module}] [WARN] ${message}`, data || '');
  }

  static error(module: string, message: string, error?: any) {
    console.error(`[StudioOS::${module}] [ERROR] ${message}`, error || '');
  }
}
