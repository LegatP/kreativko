import db, {
  addDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  getAllFromCollection,
} from "@/lib/firebase/firestore";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
  WithFieldValue,
  doc,
  collection,
  query,
  QueryConstraint,
} from "firebase/firestore";
import {
  useDocumentData,
  useDocumentDataOnce,
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";

/**
 * Creates a generic Firestore data converter for any entity type.
 * Ensures the document ID is included in the returned data.
 */
export function createConverter<
  T extends { id: string }
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>): DocumentData {
      return data;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options?: SnapshotOptions
    ): T {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      } as T;
    },
  };
}

/**
 * Generic collection factory that creates a complete CRUD interface with react-firebase-hooks support.
 *
 * @example
 * ```ts
 * // Define your entity type
 * interface Product {
 *   id: string;
 *   name: string;
 *   price: number;
 *   createdAt: Timestamp;
 * }
 *
 * // Create the collection
 * const products = createCollection<Product>("products");
 *
 * // Use CRUD operations
 * await products.create({ name: "T-Shirt", price: 19.99 });
 * await products.update("product-id", { price: 24.99 });
 * const product = await products.get("product-id");
 * const allProducts = await products.getAll();
 *
 * // Use react-firebase-hooks for real-time data
 * const [product, loading, error] = products.useDoc("product-id");
 * const [products, loading, error] = products.useCollection();
 * ```
 */
export function createCollection<T extends { id: string }>(
  collectionName: string
) {
  const converter = createConverter<T>();

  // Get a document reference with converter
  const getDocRef = (id: string) =>
    doc(db, collectionName, id).withConverter(converter);

  // Get a collection reference with converter
  const getCollectionRef = () =>
    collection(db, collectionName).withConverter(converter);

  return {
    // Collection metadata
    collectionName,
    converter,

    // CRUD Operations
    create: addDoc<T>(collectionName),
    update: updateDoc<T>(collectionName),
    get: getDoc<T>(collectionName),
    delete: deleteDoc(collectionName),
    getAll: () => getAllFromCollection<T>(collectionName, converter),

    // React Firebase Hooks - Document
    useDoc: (id: string) => {
      const docRef = getDocRef(id);
      return useDocumentData<T>(docRef);
    },

    useDocOnce: (id: string) => {
      const docRef = getDocRef(id);
      return useDocumentDataOnce<T>(docRef);
    },

    // React Firebase Hooks - Collection
    useCollection: (queryConstraints?: QueryConstraint[]) => {
      const collectionRef = getCollectionRef();
      const q = queryConstraints
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;
      return useCollectionData<T>(q);
    },

    useCollectionOnce: (queryConstraints?: QueryConstraint[]) => {
      const collectionRef = getCollectionRef();
      const q = queryConstraints
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;
      return useCollectionDataOnce<T>(q);
    },

    // Helpers for building queries
    ref: {
      doc: getDocRef,
      collection: getCollectionRef,
    },
  };
}

export type Collection<T extends { id: string }> = ReturnType<
  typeof createCollection<T>
>;
