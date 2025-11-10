// src/modules/products/product.controller.ts

import { Response } from 'express';
import * as productService from './product.service';
import { NewProduct } from '../../../drizzle/schema';
import { sendBaseError, sendBaseSuccess } from '../../utils/response';
import { AuthRequest } from '../../types/express';

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
