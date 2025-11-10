import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { sendBaseError } from '../../utils/response';

const positiveNumeric = Joi.number()
  .precision(2)
  .positive()
  .strict()
  .required();

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot exceed 100 characters.',
    'any.required': 'Name is required.',
  }),

  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters long.',
    'any.required': 'Description is required.',
  }),

  price: positiveNumeric.messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than 0.',
    'any.required': 'Price is required.',
  }),

  stock: Joi.number().integer().min(0).strict().required().messages({
    'number.base': 'Stock must be an integer.',
    'number.integer': 'Stock must be a whole number.',
    'number.min': 'Stock cannot be negative.',
    'any.required': 'Stock is required.',
  }),

  category: Joi.string().required().messages({
    'any.required': 'Category is required.',
  }),
});

// Middleware to validate the product creation request body
export const validateCreateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createProductSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return sendBaseError(
      res,
      error.details.map((detail) => detail.message),
      'Validation failed.',
      400
    );
  }
  next();
};
