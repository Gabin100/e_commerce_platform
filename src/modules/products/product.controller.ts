// src/modules/products/product.controller.ts

import { Request, Response } from 'express';
import * as productService from './product.service';
import { NewProduct } from '../../../drizzle/schema';
import { sendBaseError, sendBaseSuccess } from '../../utils/response';

export async function createProductController(req: Request, res: Response) {
  const productData = req.body as Omit<NewProduct, 'id' | 'createdAt'>;

  try {
    // Service handles saving to DB
    const newProduct = await productService.createProduct(productData);
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
