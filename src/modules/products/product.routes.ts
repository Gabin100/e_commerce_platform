// src/modules/products/product.routes.ts

import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  getProductDetailsController,
  getProductsController,
  updateProductController,
} from './product.controller';
import {
  validateCreateProduct,
  validateProductIdParam,
  validateUpdateProduct,
} from './product.validation';
import { authenticate, authorizeRole } from '../../middlewares/auth.middleware';

const productRouter = Router();

// Endpoint: POST /products
// Steps:
// authenticate: Checks for a valid JWT (401 Unauthorized)
// authorizeRole('admin'): Checks for 'Admin' role in payload (403 Forbidden)
// validateCreateProduct: Checks request body format (400 Bad Request)
// createProductController: Executes business logic
productRouter.post(
  '/',
  authenticate,
  authorizeRole('admin'),
  validateCreateProduct,
  createProductController
);

// Endpoint: PUT /products/:id
// Authorization: Must be an 'admin'
// Validation: Uses the optional update schema
productRouter.put(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  validateUpdateProduct,
  updateProductController
);

// Endpoint: GET /products?page=&pageSize=&search=
// Public access - no authentication required
productRouter.get('/', getProductsController);

// Endpoint: GET /products/:id
// Public access - no authentication required
// Validation: Validates the product ID parameter
productRouter.get('/:id', validateProductIdParam, getProductDetailsController);

// Endpoint: DELETE /products/:id
// Steps:
// authenticate: Checks for a valid JWT (401 Unauthorized)
// authorizeRole('admin'): Checks for 'Admin' role in payload (403 Forbidden)
// validateProductIdParam: Validates the product ID parameter (400 Bad Request)
// deleteProductController: Executes deletion logic
productRouter.delete(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  validateProductIdParam,
  deleteProductController
);

export default productRouter;
