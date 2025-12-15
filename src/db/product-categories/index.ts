import { addDoc, updateDoc, getDoc } from "@/lib/firebase/firestore";
import {
  Timestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  productIds?: string[]; // Array of product IDs in this category
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const collectionName = "product_categories";

export const createProductCategory = addDoc<ProductCategory>(collectionName);

export const updateProductCategory = updateDoc<ProductCategory>(collectionName);

export const getProductCategory = getDoc<ProductCategory>(collectionName);

export const productCategoryConverter: FirestoreDataConverter<ProductCategory> =
  {
    toFirestore(category: ProductCategory) {
      return category;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options?: SnapshotOptions
    ): ProductCategory {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      } as ProductCategory;
    },
  };
