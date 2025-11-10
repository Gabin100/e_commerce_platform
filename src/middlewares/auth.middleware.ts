import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import envVars from '../../env';
import { sendBaseError } from '../utils/response';

// Extend the Request object to include the user payload
interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

/**
 * Verifies the JWT and attaches the user payload to the request.
 * Returns 401 Unauthorized if token is missing or invalid.
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendBaseError(res, [], 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendBaseError(res, [], 'Access denied. No token provided.', 401);
  }

  try {
    const payload = jwt.verify(token, envVars.JWT_SECRET_KEY) as {
      userId: number;
      username: string;
      role: string;
    };
    req.user = payload; // Attach user payload
    next();
  } catch (ex) {
    return sendBaseError(res, [], 'Invalid token.', 401);
  }
};

/**
 * Checks if the authenticated user has the required role (e.g., 'Admin').
 * Returns 403 Forbidden if the role is insufficient.
 */
export const authorizeRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendBaseError(res, [], 'Authentication required.', 401);
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return sendBaseError(
        res,
        [],
        `Forbidden. Only users with the '${requiredRole}' role can access this resource.`,
        403
      );
    }
    next();
  };
};
