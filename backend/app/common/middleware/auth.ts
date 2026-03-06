import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/common/helpers/tokenUtils';
import { errorResponse } from '@/common/types/response.type';
import { DecodedToken } from '@/common/types/auth.type';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(errorResponse('No token provided'));
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json(errorResponse('Invalid or expired token'));
    }
  } catch (error) {
    res.status(500).json(errorResponse('Authentication error'));
  }
};

export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(errorResponse('Forbidden: Insufficient permissions'));
      return;
    }

    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch {
      }
    }

    next();
  } catch (error) {
    next();
  }
};
