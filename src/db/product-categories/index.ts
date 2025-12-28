import { orderBy, where } from "firebase/firestore";
import { createCollection } from "../createCollection";
import { ProductCategory } from "./types";

// Re-export types
export type { ProductCategory };

const PRODUCT_CATEGORIES_COLLECTION = "product_categories";

// Create the collection with full CRUD + hooks support
const categoriesCollection = createCollection<ProductCategory>(
  PRODUCT_CATEGORIES_COLLECTION
);

// Export collection metadata
export { PRODUCT_CATEGORIES_COLLECTION };
export const productCategoryConverter = categoriesCollection.converter;

// Export CRUD operations
export const createProductCategory = categoriesCollection.create;
export const updateProductCategory = categoriesCollection.update;
export const getProductCategory = categoriesCollection.get;
export const deleteProductCategory = categoriesCollection.delete;

/**
 * Get all product categories from the database
 */
export async function getAllProductCategories(): Promise<ProductCategory[]> {
  return categoriesCollection.getAll();
}

// React Firebase Hooks
export const useCategory = categoriesCollection.useDoc;
export const useCategoryOnce = categoriesCollection.useDocOnce;
export const useCategories = () =>
  categoriesCollection.useCollection([orderBy("createdAt", "desc")]);
export const useCategoriesOnce = () =>
  categoriesCollection.useCollectionOnce([orderBy("createdAt", "desc")]);
export const useCategoryBySlug = (slug: string) =>
  categoriesCollection.useCollectionOnce([where("slug", "==", slug)]);
