import winston from "winston";
import { ILogger } from "../../../domain/interfaces/ILogger";

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    const isActive = process.env.LOG_ACTIVE === "true";
    const level = process.env.LOG_LEVEL || "info";

    this.logger = winston.createLogger({
      level: isActive ? level : "silent",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console()
      ]
    });
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }
}