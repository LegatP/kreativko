import { addDoc, updateDoc, getDoc } from "@/lib/firebase/firestore";
import {
  Timestamp,
  FirestoreDataConverter,
  SnapshotOptions,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export interface ProductVariable {
  key: string;
  title: string;
  type?: "string" | "number";
  placeholder: string;
  suggestions?: string[];
}

export interface ProductDesign {
  title: string;
  url: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  defaultShirtColor: string;
  variables: ProductVariable[];
  prompt: string;
  promptType: "edit" | "create";
  designs: ProductDesign[];
  categoryIds?: string[]; // Array of category IDs this product belongs to
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

const collectionName = "products";

export const createProduct = addDoc<Product>(collectionName);

export const updateProduct = updateDoc<Product>(collectionName);

export const getProduct = getDoc<Product>(collectionName);

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product) {
    return product;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): Product {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    } as Product;
  },
};
