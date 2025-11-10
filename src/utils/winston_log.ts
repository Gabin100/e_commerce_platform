import * as Winston from 'winston';
import 'winston-daily-rotate-file';
import envVars from '../env';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

// Create a daily rotating transport for each log type
const transportError = new Winston.transports.DailyRotateFile({
  filename: 'logs/error/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d', // Keep logs for the last 30 days
});

const transportAccess = new Winston.transports.DailyRotateFile({
  filename: 'logs/access/access-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'http',
  maxSize: '20m',
  maxFiles: '30d',
});

const transportCombined = new Winston.transports.DailyRotateFile({
  filename: 'logs/combined/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  maxSize: '20m',
  maxFiles: '30d',
});

const { combine, timestamp, printf } = Winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = Winston.createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [transportError, transportAccess, transportCombined],
});

export const Logger = (details: {
  level: LogLevel;
  message: string;
  label: string;
}) => {
  return logger.log({
    level: details.level,
    message: details.message,
    label: details.label,
  });
};

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (envVars.NODE_ENV !== 'production') {
  logger.add(
    new Winston.transports.Console({
      format: Winston.format.simple(),
    })
  );
}
