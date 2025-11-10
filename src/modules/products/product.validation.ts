import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { sendBaseError } from '../../utils/response';

const baseName = Joi.string().min(3).max(100);
const baseDescription = Joi.string().min(10);
const basePrice = Joi.number().precision(2).positive().strict();
const baseStock = Joi.number().integer().min(0).strict();
const baseCategory = Joi.string();

export const createProductSchema = Joi.object({
  name: baseName.required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot exceed 100 characters.',
    'any.required': 'Name is required.',
  }),

  description: baseDescription.required().messages({
    'string.min': 'Description must be at least 10 characters long.',
    'any.required': 'Description is required.',
  }),

  price: basePrice.required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than 0.',
    'any.required': 'Price is required.',
  }),

  stock: baseStock.required().messages({
    'number.base': 'Stock must be an integer.',
    'number.integer': 'Stock must be a whole number.',
    'number.min': 'Stock cannot be negative.',
    'any.required': 'Stock is required.',
  }),

  category: baseCategory.required().messages({
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

export const updateProductSchema = Joi.object({
  name: baseName.optional().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot exceed 100 characters.',
  }),

  description: baseDescription.optional().messages({
    'string.min': 'Description must be at least 10 characters long.',
  }),

  price: basePrice.optional().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than 0.',
  }),

  stock: baseStock.optional().messages({
    'number.base': 'Stock must be an integer.',
    'number.integer': 'Stock must be a whole number.',
    'number.min': 'Stock cannot be negative.',
  }),

  category: baseCategory.optional(),
})
  .min(1)
  .messages({
    'object.min':
      'Request body cannot be empty. At least one field (name, description, price, stock, or category) must be provided for update.',
  });

// Middleware to validate the product update request body
export const validateUpdateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateProductSchema.validate(req.body, {
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
