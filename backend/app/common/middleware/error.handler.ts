import { Request, Response, NextFunction } from 'express';
import { errorResponse, JsonValue } from '@/common/types/response.type';
import { AppError } from '@/common/errors/AppError';

export interface LegacyAppError extends Error {
  statusCode?: number;
  details?: JsonValue;
}

export const errorHandler = (
  error: LegacyAppError | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // AppError instances carry a typed statusCode
  const statusCode = error instanceof AppError
    ? error.statusCode
    : (error as LegacyAppError).statusCode ?? 500;

  const message = error.message || 'Internal server error';

  const details = error instanceof AppError ? error.details : (error as LegacyAppError).details;

  console.error(`[Error] ${statusCode} - ${message}`);
  if (error.stack && process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  res.status(statusCode).json(errorResponse(message, details));
};
