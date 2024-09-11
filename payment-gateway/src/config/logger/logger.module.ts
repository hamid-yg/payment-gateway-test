import {
  format,
  transports,
  createLogger,
  Logger,
  LoggerOptions,
} from 'winston';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const getLoggerConfiguration = (): LoggerOptions => ({
  format: format.errors({ stack: true }),
  transports: [
    new transports.Console({
      format: format.combine(
        format.printf(
          (info) =>
            `${info.level} ${info.message} ${info.stack ? info.stack : ''}`,
        ),
      ),
    }),
  ],
  level: configService.get('LOG_LEVEL'),
});

export const logger: Logger = createLogger(getLoggerConfiguration());

export const getPinoConfiguration = () => ({
  pinoHttp: {
    transport:
      configService.get('ENV') !== 'development' &&
      configService.get('ENV') !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
    base: { pid: process.pid },
  },
});
