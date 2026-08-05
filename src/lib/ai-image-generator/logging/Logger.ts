export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  module: string;
  message: string;
  correlationId?: string;
  executionTimeMs?: number;
  timestamp: string;
  details?: any;
}

export class Logger {
  private static logs: LogEntry[] = [];

  static info(module: string, message: string, details?: any, correlationId?: string, executionTimeMs?: number): void {
    this.log('info', module, message, details, correlationId, executionTimeMs);
  }

  static warn(module: string, message: string, details?: any, correlationId?: string, executionTimeMs?: number): void {
    this.log('warn', module, message, details, correlationId, executionTimeMs);
  }

  static error(module: string, message: string, details?: any, correlationId?: string, executionTimeMs?: number): void {
    this.log('error', module, message, details, correlationId, executionTimeMs);
  }

  private static log(
    level: LogEntry['level'],
    module: string,
    message: string,
    details?: any,
    correlationId?: string,
    executionTimeMs?: number
  ): void {
    const entry: LogEntry = {
      level,
      module,
      message,
      correlationId,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      details,
    };
    this.logs.push(entry);
    if (this.logs.length > 500) this.logs.shift();
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }
}
