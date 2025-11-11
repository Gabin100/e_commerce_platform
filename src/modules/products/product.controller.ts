// src/modules/products/product.controller.ts

import { Request, Response } from 'express';
import * as productService from './product.service';
import { NewProduct, Product } from '../../../drizzle/schema';
import {
  sendBaseError,
  sendBaseSuccess,
  sendPaginatedError,
  sendPaginatedSuccess,
} from '../../utils/response';
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

export async function updateProductController(req: AuthRequest, res: Response) {
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
    const updatedProduct = await productService.updateProduct(
      productId,
      updateData
    );

    if (!updatedProduct) {
      return sendBaseError(
        res,
        [`Product with ID ${productId} not found.`],
        'Product not found.',
        404,
        'PRODUCT_NOT_FOUND'
      );
    }

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

export async function getProductsController(req: AuthRequest, res: Response) {
  // Extract and sanitize query parameters, applying defaults
  const page = parseInt(req.query.page as string) || 1;
  // Use 'limit' or 'pageSize' for flexibility
  const limit =
    parseInt((req.query.limit as string) || (req.query.pageSize as string)) ||
    10;

  // Extract the search query parameter
  const search = req.query.search as string | undefined;

  // Ensure parameters are positive integers
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);

  try {
    // Fetch paginated products, with optional search
    const paginatedData = !search
      ? await productService.getPaginatedProducts(safePage, safeLimit)
      : await productService.searchProducts(safePage, safeLimit, search);

    return sendPaginatedSuccess(
      res,
      paginatedData.products,
      {
        pageNumber: paginatedData.currentPage,
        pageSize: paginatedData.pageSize,
        totalPages: paginatedData.totalPages,
        totalSize: paginatedData.totalProducts,
      },
      'Products retrieved successfully.',
      200
    );
  } catch (error) {
    return sendPaginatedError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while retrieving products.',
      500,
      'GET_PRODUCTS_ERROR'
    );
  }
}

export async function getProductDetailsController(req: Request, res: Response) {
  // Get the product ID from the URL parameters and validate
  const productId = req.params?.id;
  if (!productId || typeof productId !== 'string') {
    return sendBaseError(
      res,
      [`Product ID is required and must be a string.`],
      'Invalid product ID format.',
      400,
      'INVALID_PRODUCT_ID'
    );
  }

  try {
    const product = await productService.getProductById(productId);

    if (!product) {
      return sendBaseError(
        res,
        [],
        `Product with ID ${productId} not found.`,
        404,
        'PRODUCT_NOT_FOUND'
      );
    }

    return sendBaseSuccess(
      res,
      product,
      'Product details retrieved successfully.',
      200
    );
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while retrieving product details.',
      500,
      'GET_PRODUCT_DETAILS_ERROR'
    );
  }
}

export async function deleteProductController(req: AuthRequest, res: Response) {
  // Get the product ID from the URL parameters and validate
  const productId = req.params.id?.trim();
  if (!productId || typeof productId !== 'string') {
    return sendBaseError(
      res,
      [`Product ID is required and must be a string.`],
      'Invalid product ID format.',
      400,
      'INVALID_PRODUCT_ID'
    );
  }

  try {
    // Attempt to delete the product
    const rowsDeleted = await productService.deleteProduct(productId);

    if (rowsDeleted === 0) {
      return sendBaseError(
        res,
        [],
        `Product with ID ${productId} not found.`,
        404,
        'PRODUCT_NOT_FOUND'
      );
    }

    return sendBaseSuccess(res, {}, `Product deleted successfully.`, 200);
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while deleting the product.',
      500,
      'DELETE_PRODUCT_ERROR'
    );
  }
}

export async function uploadProductImageController(
  req: AuthRequest,
  res: Response
) {
  const productId = req.params.id?.trim();

  if (!req.file) {
    return sendBaseError(
      res,
      ['file not found.'],
      'No file uploaded. Please attach an image file.',
      400,
      'INVALID_FILE_UPLOAD'
    );
  }

  if (!productId || typeof productId !== 'string') {
    return sendBaseError(
      res,
      ['Product ID is required and must be a string.'],
      'Invalid product ID format.',
      400,
      'INVALID_PRODUCT_ID'
    );
  }

  // Construct the image URL/path to be saved in the database
  const relativeImagePath = `/uploads/product_images/${req.file.filename}`;

  try {
    // Update the product record with the new image path/URL
    const updatedProduct: Product | null = await productService.updateProduct(
      productId,
      {
        imageUrl: relativeImagePath,
      }
    );

    if (!updatedProduct) {
      return sendBaseError(
        res,
        [`Product with ID ${productId} not found.`],
        'Product not found.',
        404,
        'PRODUCT_NOT_FOUND'
      );
    }

    return sendBaseSuccess(
      res,
      updatedProduct,
      'Product image uploaded successfully.',
      200
    );
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while uploading the image.',
      500,
      'UPLOAD_PRODUCT_IMAGE_ERROR'
    );
  }
}
