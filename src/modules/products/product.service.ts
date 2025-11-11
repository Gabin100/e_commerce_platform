import { count, desc, eq, ilike } from 'drizzle-orm';
import db from '../../../drizzle/db';
import { products, NewProduct, Product } from '../../../drizzle/schema';

/**
 * Creates a new product record in the database.
 * @param userId The ID of the user creating the product.
 * @param productData The data for the new product.
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
 * @param id The unique identifier of the product to update.
 * @param productData The fields to update for the product.
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

interface PaginatedProducts {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalProducts: number;
  products: {
    id: string;
    name: string;
    price: string;
    stock: number;
  }[];
}
/**
 * Retrieves a list of products with pagination details.
 * @param page The requested page number (1-based).
 * @param limit The number of products per page.
 * @returns {PaginatedProducts} An object containing the product list and pagination metadata.
 */
export async function getPaginatedProducts(
  page: number,
  limit: number
): Promise<PaginatedProducts> {
  const offset = (page - 1) * limit;

  // Get the total count of all products
  const [totalCountResult] = await db.select({ count: count() }).from(products);
  const totalProducts = totalCountResult ? totalCountResult.count : 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch the products for the current page
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      stock: products.stock,
      category: products.category,
    })
    .from(products)
    .limit(limit)
    .offset(offset);

  return {
    currentPage: page,
    pageSize: productList.length,
    totalPages: totalPages,
    totalProducts: totalProducts,
    products: productList,
  };
}

/**
 * Retrieves a list of products with pagination and search details.
 * @param page The requested page number (1-based).
 * @param limit The number of products per page.
 * @param search Optional search term for product name matching.
 * @returns {PaginatedProducts} An object containing the product list and pagination metadata.
 */
export async function searchProducts(
  page: number,
  limit: number,
  search?: string
): Promise<PaginatedProducts> {
  const offset = (page - 1) * limit;

  let whereClause = undefined;
  if (search && search.trim() !== '') {
    whereClause = ilike(products.name, `%${search.trim()}%`);
  }

  // Get the total count of products matching the criteria
  const [totalCountResult] = await db
    .select({ count: count() })
    .from(products)
    .where(whereClause);

  const totalProducts = totalCountResult ? totalCountResult.count : 0;

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch the products for the current page
  const productList = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      stock: products.stock,
      category: products.category,
    })
    .from(products)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  const essentialProducts = productList;

  return {
    currentPage: page,
    pageSize: essentialProducts.length,
    totalPages: totalPages,
    totalProducts: totalProducts,
    products: essentialProducts,
  };
}

/**
 * Retrieves the details of a single product by ID.
 * @param id The unique identifier of the product.
 * @returns {Product | null} The complete product object, or null if not found.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return product || null;
}

/**
 * Deletes a product from the database by ID.
 * @param id The unique identifier of the product.
 * @returns {number} The number of rows deleted (0 or 1).
 */
export async function deleteProduct(id: string): Promise<number> {
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id });

  return deletedProduct ? 1 : 0;
}
