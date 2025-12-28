import { Timestamp } from "firebase/firestore";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds?: string[]; // Array of product IDs in this category
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
