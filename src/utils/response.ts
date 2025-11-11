import { Response } from 'express';
import { Logger, LogLevel } from './winston_log';

/**
 * Interface for a base API response.
 */
export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  object: T | null;
  errors: string[] | null;
}

/**
 * Interface for a paginated API response.
 */
export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  object: T[];
  pageNumber: number;
  pageSize: number;
  totalSize: number;
  totalPages?: number;
  errors: string[] | null;
}

/**
 * Creates a base success response.
 * @param res - Express Response object.
 * @param data - The object to include in the response.
 * @param message - success message (defaults to 'successful').
 * @param statusCode - HTTP status code (defaults to 200).
 */
export const sendBaseSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'successful',
  statusCode: number = 200
): void => {
  const response: BaseResponse<T> = {
    success: true,
    message,
    object: data,
    errors: null,
  };
  res.status(statusCode).json(response);
};

/**
 * Creates a base error response.
 * @param res - Express Response object.
 * @param errors - List of error messages.
 * @param message - error message (defaults to 'An error occurred').
 * @param statusCode - HTTP status code (defaults to 500).
 */
export const sendBaseError = (
  res: Response,
  errors: string[],
  message: string = 'An error occurred',
  statusCode: number = 500,
  label: string = 'GENERAL'
): void => {
  const response: BaseResponse<null> = {
    success: false,
    message,
    object: null,
    errors,
  };
  Logger({
    level: LogLevel.ERROR,
    message: message + ' | ' + errors.join('; '),
    label: label,
  });
  res.status(statusCode).json(response);
};

/**
 * Creates a paginated success response.
 * @param res - Express Response object.
 * @param data - The list of objects to include.
 * @param pagination - Pagination metadata.
 * @param message - success message (defaults to 'Data retrieved successfully').
 * @param statusCode - HTTP status code (defaults to 200).
 */
export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalSize: number;
    totalPages?: number;
  },
  message: string = 'Data retrieved successfully',
  statusCode: number = 200
): void => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    object: data,
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
    totalSize: pagination.totalSize,
    totalPages: pagination.totalPages || 0,
    errors: null,
  };
  res.status(statusCode).json(response);
};

/**
 * Creates a paginated error response (e.g., for invalid pagination params).
 * @param res - Express Response object.
 * @param errors - List of error messages.
 * @param message - error message (defaults to 'An error occurred').
 * @param statusCode - HTTP status code (defaults to 500).
 */
export const sendPaginatedError = (
  res: Response,
  errors: string[],
  message: string = 'An error occurred',
  statusCode: number = 500,
  label: string = 'GENERAL'
): void => {
  const response: PaginatedResponse<null> = {
    success: false,
    message,
    object: [],
    pageNumber: 0,
    pageSize: 0,
    totalSize: 0,
    totalPages: 0,
    errors,
  };
  Logger({
    level: LogLevel.ERROR,
    message: message + ' | ' + errors.join('; '),
    label: label,
  });
  res.status(statusCode).json(response);
};
