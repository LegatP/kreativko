import { orderBy, where } from "firebase/firestore";
import { createCollection } from "../createCollection";
import {
  Product,
  ProductDesign,
  PromptSuggestion,
  PromptSuggestionVariable,
} from "./types";

// Re-export types
export type {
  Product,
  ProductDesign,
  PromptSuggestion,
  PromptSuggestionVariable,
};

const PRODUCTS_COLLECTION = "products";

// Create the collection with full CRUD + hooks support
const productsCollection = createCollection<Product>(PRODUCTS_COLLECTION);

// Export collection metadata
export { PRODUCTS_COLLECTION };
export const productConverter = productsCollection.converter;

// Export CRUD operations
export const createProduct = productsCollection.create;
export const updateProduct = productsCollection.update;
export const getProduct = productsCollection.get;
export const deleteProduct = productsCollection.delete;

/**
 * Get all products from the database
 */
export async function getAllProducts(): Promise<Product[]> {
  return productsCollection.getAll();
}

/**
 * Get products by category ID
 * If categoryId is undefined, returns all products
 */
export async function getProductsByCategory(
  categoryId?: string
): Promise<Product[]> {
  const allProducts = await getAllProducts();

  if (!categoryId) {
    return allProducts;
  }

  return allProducts.filter((product) =>
    product.categoryIds?.includes(categoryId)
  );
}

// React Firebase Hooks
export const useProduct = productsCollection.useDoc;
export const useProductOnce = productsCollection.useDocOnce;
export const useProducts = () =>
  productsCollection.useCollection([orderBy("createdAt", "desc")]);
export const useProductsByCategory = (categoryId: string) =>
  productsCollection.useCollection([
    where("categoryIds", "array-contains", categoryId),
  ]);
export const useProductsByCategoryOnce = (categoryId: string | undefined) =>
  productsCollection.useCollectionOnce(
    categoryId ? [where("categoryIds", "array-contains", categoryId)] : undefined
  );
export const useProductBySlug = (slug: string) =>
  productsCollection.useCollectionOnce([where("slug", "==", slug)]);
