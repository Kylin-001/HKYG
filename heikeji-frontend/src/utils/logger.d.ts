/**
 * Logger工具类型声明
 */

declare interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  logApiResponseTime: (url: string, duration: number, status: number) => void;
}

declare const logger: Logger;

export default logger;
