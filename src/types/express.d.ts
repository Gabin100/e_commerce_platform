export interface UserPayload {
  userId: string;
  username: string;
  role: string;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: UserPayload;
  fileValidationError?: string;
}
