// src/modules/products/product.routes.ts

import { Router } from 'express';
import {
  createProductController,
  getProductsController,
  updateProductController,
} from './product.controller';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from './product.validation';
import { authenticate, authorizeRole } from '../../middlewares/auth.middleware';

const productRouter = Router();

// Endpoint: POST /products
// Steps:
// 1. authenticate: Checks for a valid JWT (401 Unauthorized)
// 2. authorizeRole('admin'): Checks for 'Admin' role in payload (403 Forbidden)
// 3. validateCreateProduct: Checks request body format (400 Bad Request)
// 4. createProductController: Executes business logic
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

// Endpoint: GET /products?page=&pageSize=
// Public access - no authentication required
productRouter.get('/', getProductsController);

export default productRouter;
