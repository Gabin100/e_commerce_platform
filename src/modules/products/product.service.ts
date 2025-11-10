import { eq } from 'drizzle-orm';
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

// Define the possible update data structure
interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

/**
 * Updates an existing product in the database.
 * @returns {Product | null} The updated product record, or null if the product was not found.
 */
export async function updateProduct(
  id: string,
  productData: UpdateProductData
): Promise<Product | null> {
  const updatePayload: Partial<Product> = {};

  if (productData.name) updatePayload.name = productData.name;
  if (productData.description)
    updatePayload.description = productData.description;
  if (productData.category) updatePayload.category = productData.category;

  // Convert numeric inputs to string/integer as per Drizzle schema definition
  if (productData.price !== undefined)
    updatePayload.price = productData.price.toString();
  if (productData.stock !== undefined) updatePayload.stock = productData.stock;

  // Perform the update and return the updated row
  const [updatedProduct] = await db
    .update(products)
    .set(updatePayload)
    .where(eq(products.id, id))
    .returning();

  // Check if an update actually occurred
  return updatedProduct || null;
}
