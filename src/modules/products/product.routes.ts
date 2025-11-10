// src/modules/products/product.routes.ts

import { Router } from 'express';
import { createProductController } from './product.controller';
import { validateCreateProduct } from './product.validation';
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

export default productRouter;
