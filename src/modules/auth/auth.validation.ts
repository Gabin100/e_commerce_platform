import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { sendBaseError } from '../../utils/response';

// Regex for alphanumeric (letters and numbers only)
const alphanumeric = /^[a-zA-Z0-9]+$/;

// Regex for strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;

export const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(3) // Added min length for practical use
    .max(30)
    .pattern(alphanumeric)
    .messages({
      'string.pattern.base':
        'Username must be alphanumeric (letters and numbers only).',
      'any.required': 'Username is required.',
    }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string().required().pattern(strongPassword).messages({
    'string.pattern.base':
      'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.',
    'any.required': 'Password is required.',
  }),
});

// Middleware to use in routes
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return sendBaseError(
      res,
      error.details.map((d) => d.message),
      'Validation Error',
      422
    );
  }
  next();
};
