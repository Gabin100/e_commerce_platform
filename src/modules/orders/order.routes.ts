import { Router } from 'express';
import { placeOrderController } from './order.controller';
import { validatePlaceOrder } from './order.validation';
import { authenticate, authorizeRole } from '../../middlewares/auth.middleware';

const orderRouter = Router();

// Endpoint: POST /orders
// Authorization: Must be an authenticated user.
// Validation: Validates order items in request body.
orderRouter.post(
  '/',
  authenticate,
  authorizeRole('user'),
  validatePlaceOrder,
  placeOrderController
);

export default orderRouter;
