import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { sendBaseError } from '../../utils/response';

const orderItemSchema = Joi.object({
  productId: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
    'string.base': 'Product ID must be a string.',
    'string.uuid': 'Product ID must be a valid UUID v4.',
    'any.required': 'Product ID is required.',
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'quantity must be an integer.',
    'number.min': 'quantity must be at least 1.',
    'any.required': 'quantity is required.',
  }),
});

export const placeOrderSchema = Joi.array()
  .items(orderItemSchema)
  .min(1)
  .required()
  .messages({
    'array.base': 'Request body must be an array of products.',
    'array.min': 'Order must contain at least one item.',
    'any.required': 'Order array is required.',
  });

// Middleware to validate the order items request body
export const validatePlaceOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = placeOrderSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return sendBaseError(
      res,
      error.details.map((d) => d.message),
      'Order validation failed.',
      422
    );
  }
  next();
};
