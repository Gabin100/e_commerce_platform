import db from '../../../drizzle/db';
import {
  orders,
  orderItems,
  products,
  NewProduct,
  NewOrderItem,
  OrderItem,
  Order,
} from '../../../drizzle/schema';
import { desc, eq, inArray, sql } from 'drizzle-orm';

interface ItemRequest {
  productId: string;
  quantity: number;
}

// Custom error for controlled rollback/response
export class StockError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'StockError';
  }
}

/**
 * Places a new order within a transaction, handling stock checks and updates.
 * @param userId The ID of the authenticated user.
 * @param items An array of items to order, each with productId and quantity.
 * @returns {Order & { items: OrderItem[] }} The created order and its items.
 */
export async function placeNewOrder(
  userId: string,
  items: ItemRequest[]
): Promise<Order & { items: OrderItem[] }> {
  // Extract unique product IDs
  const productIds = items.map((i) => i.productId);

  let createdOrder: Order;
  let createdItems: OrderItem[] = [];
  let totalPrice: number = 0;

  // --- START TRANSACTION ---
  await db.transaction(async (tx) => {
    // 1. Fetch products and check stock
    const requestedProducts = await tx
      .select()
      .from(products)
      .where(inArray(products.id, productIds))
      // Lock the rows to prevent race conditions during stock check/update
      .for('update');

    // Map for easy lookup: productId -> Product object
    const productMap = new Map<string, NewProduct>();
    requestedProducts.forEach((p) => productMap.set(p.id, p));

    // Validation and Price Calculation
    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new StockError(
          `Product with ID ${item.productId} not found.`,
          404
        );
      }

      const currentStock = product.stock || 0;
      if (currentStock < item.quantity) {
        throw new StockError(
          `Insufficient stock. Only ${currentStock} units of ${product.name} available.`
        );
      }

      // Calculate item price
      const unitPrice = parseFloat(product.price);
      totalPrice += unitPrice * item.quantity;
    }

    // Create the main order record
    const [order] = await tx
      .insert(orders)
      .values({
        userId: userId,
        totalPrice: totalPrice.toFixed(2),
        status: 'pending',
      })
      .returning();
    if (!order) {
      throw new StockError(
        `Failed to create order. Please try again later.`,
        500
      );
    }
    createdOrder = order;

    // Create the order items and update stock concurrently
    const itemInserts: NewOrderItem[] = [];
    const stockUpdates = [];

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      const unitPrice = parseFloat(product.price);

      // Prepare Order Item insert
      itemInserts.push({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice.toFixed(2),
      });

      // Prepare Stock Update
      // Use sql template literal for atomic stock update
      stockUpdates.push(
        tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId))
      );
    }

    // Execute all stock updates
    await Promise.all(stockUpdates);

    // Execute Order Item inserts
    createdItems = await tx.insert(orderItems).values(itemInserts).returning();
  });
  // --- END TRANSACTION: Commit if success, Rollback if error ---

  return { ...createdOrder!, items: createdItems };
}

// Define the summary fields required for the history view
type OrderSummary = Pick<Order, 'id' | 'totalPrice' | 'status' | 'createdAt'>;

/**
 * Retrieves a list of summary details for all orders placed by a specific user.
 * @param userId The ID of the authenticated user.
 * @returns {OrderSummary[]} An array of order summary objects.
 */
export async function getOrderHistoryByUserId(
  userId: string
): Promise<OrderSummary[]> {
  const userOrders = await db
    .select({
      id: orders.id,
      totalPrice: orders.totalPrice,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return userOrders;
}
