import { DrizzleError } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { MulterError } from 'multer';
import { DatabaseError } from 'pg';
import { LogLevel, Logger } from '../utils/winston_log';
import { sendBaseError } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger({
    level: LogLevel.ERROR,
    message: err.stack ? err.stack?.toString() : err.name,
    label: 'ERROR_HANDLER',
  });

  if (err instanceof ValidationError) {
    return sendBaseError(
      res,
      err.details.map((d) => d.message),
      'Validation Error',
      422
    );
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendBaseError(
        res,
        ['File size exceeds 100KB limit.'],
        'File Upload Error',
        400
      );
    }
    return sendBaseError(res, [err.message], 'File Upload Error', 400);
  }

  if (err instanceof DatabaseError) {
    const customError = err.detail ? err.detail : err.message;
    return sendBaseError(res, [customError], 'Database Error', 500);
  }

  if (err instanceof DrizzleError) {
    return sendBaseError(res, [err.message], 'Database Error', 500);
  }

  return sendBaseError(res, [err.message], 'Internal Server Error', 500);
};
