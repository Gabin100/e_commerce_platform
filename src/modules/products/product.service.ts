import db from '../../../drizzle/db';
import { products, NewProduct, Product } from '../../../drizzle/schema';

/**
 * Creates a new product record in the database.
 * @returns {Product} The newly created product record.
 */
export async function createProduct(
  userId: string,
  productData: Omit<NewProduct, 'id' | 'createdAt'>
): Promise<Product | undefined> {
  const [newProduct] = await db
    .insert(products)
    .values({
      ...productData,
      userId: userId,
      // Ensure numeric fields are converted/handled correctly for Drizzle insertion
      price: productData.price.toString(),
      stock: productData.stock,
    })
    .returning();

  return newProduct;
}
