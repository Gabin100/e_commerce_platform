// src/modules/products/product.controller.ts

import { Response } from 'express';
import * as productService from './product.service';
import { NewProduct } from '../../../drizzle/schema';
import { sendBaseError, sendBaseSuccess } from '../../utils/response';
import { AuthRequest } from '../../types/express';
import { send } from 'process';

export async function createProductController(req: AuthRequest, res: Response) {
  const productData = req.body as Omit<NewProduct, 'id' | 'createdAt'>;

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendBaseError(
        res,
        [],
        'User authentication required to create a product.',
        401
      );
    }
    // Service handles saving to DB
    const newProduct = await productService.createProduct(userId, productData);
    return sendBaseSuccess(
      res,
      newProduct,
      'Product created successfully.',
      201
    );
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while creating the product.',
      500,
      'CREATE_PRODUCT_ERROR'
    );
  }
}

// Use AuthRequest to ensure req.user is available, though not strictly needed here
export async function updateProductController(req: AuthRequest, res: Response) {
  // Get the product ID from the URL parameters and ensure it's a number
  const productId = req.params?.id;
  if (!productId || typeof productId !== 'string') {
    return sendBaseError(
      res,
      ['Product ID is required and must be a string.'],
      'Invalid product ID format.',
      400,
      'INVALID_PRODUCT_ID'
    );
  }

  const updateData = req.body;

  try {
    // Attempt to update the product
    const updatedProduct = await productService.updateProduct(
      productId,
      updateData
    );

    if (!updatedProduct) {
      // 404 Not Found if the service returns null
      return sendBaseError(
        res,
        [`Product with ID ${productId} not found.`],
        'Product not found.',
        404,
        'PRODUCT_NOT_FOUND'
      );
    }

    // Success Response: 200 OK
    return sendBaseSuccess(
      res,
      updatedProduct,
      'Product updated successfully.',
      200
    );
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while updating the product.',
      500,
      'UPDATE_PRODUCT_ERROR'
    );
  }
}
