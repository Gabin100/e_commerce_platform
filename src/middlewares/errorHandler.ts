import { DrizzleError } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { MulterError } from 'multer';
import { DatabaseError } from 'pg';
import { LogLevel, Logger } from '../utils/winston_log';

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
    return res.status(422).send({ errors: err.details });
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ errors: [{ message: 'File size exceeds 100KB limit.' }] });
    }
    return res.status(422).send({ errors: [{ message: err.message }] });
  }

  if (err instanceof DatabaseError) {
    const customError = err.detail ? err.detail : err.message;
    return res.status(500).send({ errors: [{ message: customError }] });
  }

  if (err instanceof DrizzleError) {
    return res.status(500).send({ errors: [{ message: err.message }] });
  }

  return res.status(500).send({
    errors: [{ message: 'Something went wrong', unknownError: err }],
  });
};
