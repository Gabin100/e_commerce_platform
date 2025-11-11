import { Router } from 'express';
import {
  getOrderHistoryController,
  placeOrderController,
} from './order.controller';
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

// Endpoint: GET /orders (View My Order History)
// Requires only authentication.
orderRouter.get('/', authenticate, getOrderHistoryController);

export default orderRouter;
