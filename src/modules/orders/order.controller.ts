import { Response } from 'express';
import * as orderService from './order.service';
import { AuthRequest } from '../../types/express';
import { sendBaseError, sendBaseSuccess } from '../../utils/response';

export async function placeOrderController(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  const items = req.body;

  if (!userId) {
    return sendBaseError(res, [], 'User not authenticated.', 401);
  }

  try {
    const newOrder = await orderService.placeNewOrder(userId, items);
    return sendBaseSuccess(res, newOrder, 'Order placed successfully.', 201);
  } catch (error) {
    if (error instanceof orderService.StockError) {
      return sendBaseError(
        res,
        [],
        error.message,
        error.statusCode,
        'PLACE_ORDER_ERROR'
      );
    }
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while placing the order.',
      500,
      'PLACE_ORDER_ERROR'
    );
  }
}

export async function getOrderHistoryController(
  req: AuthRequest,
  res: Response
) {
  const userId = req.user?.userId;
  if (!userId) {
    return sendBaseError(res, [], 'User not authenticated.', 401);
  }

  try {
    const orderHistory = await orderService.getOrderHistoryByUserId(userId);

    return sendBaseSuccess(
      res,
      orderHistory,
      `Found ${orderHistory.length} orders.`,
      200
    );
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred while retrieving your order history.',
      500,
      'ORDER_HISTORY_ERROR'
    );
  }
}
