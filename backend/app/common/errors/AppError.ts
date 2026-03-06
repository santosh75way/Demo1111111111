import type { JsonValue } from '@/common/types/response.type';

/**
 * Operational error thrown from service/repository layers.
 * The centralized errorHandler reads statusCode and code to build the response.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: JsonValue;

  constructor(statusCode: number, message: string, code: string, details?: JsonValue) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, message, 'NOT_FOUND');
  }

  static conflict(message: string): AppError {
    return new AppError(409, message, 'CONFLICT');
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(403, message, 'FORBIDDEN');
  }

  static badRequest(message: string, details?: JsonValue): AppError {
    return new AppError(400, message, 'BAD_REQUEST', details);
  }
}
