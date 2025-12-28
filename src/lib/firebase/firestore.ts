import app from "./init";
import {
  addDoc as firestoreAddDoc,
  updateDoc as firestoreUpdateDoc,
  getDoc as firestoreGetDoc,
  deleteDoc as firestoreDeleteDoc,
  collection,
  doc,
  DocumentData,
  WithFieldValue,
  CollectionReference,
  initializeFirestore,
  DocumentReference,
  Timestamp,
  setDoc as firestoreSetDoc,
  query,
  getDocs,
  orderBy,
  FirestoreDataConverter,
  arrayUnion as firestoreArrayUnion,
} from "firebase/firestore";

const db = initializeFirestore(
  app,
  {},
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE
);

export type AddDocumentData<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

function getDocReference(
  ref: string | DocumentReference<DocumentData>
): DocumentReference<DocumentData> {
  return typeof ref === "string" ? doc(db, ref) : ref;
}

function getCollectionReference(
  ref: string | CollectionReference<DocumentData> | (() => string)
): CollectionReference<DocumentData> {
  if (typeof ref === "string") {
    return collection(db, ref);
  } else if (typeof ref === "function") {
    return collection(db, ref());
  } else {
    return ref;
  }
}

export function addDoc<T>(
  ref: string | CollectionReference<DocumentData> | (() => string)
) {
  return async (data: AddDocumentData<T>) => {
    const now = Timestamp.now();
    const finalData = { ...data, createdAt: now, updatedAt: now };
    const colRef = getCollectionReference(ref);
    const docRef = await firestoreAddDoc(colRef, finalData);
    return { ...finalData, id: docRef.id } as T;
  };
}

export function setDoc<T>(ref: string | DocumentReference<DocumentData>) {
  return async (data: AddDocumentData<T>): Promise<T & { id: string }> => {
    const docRef = getDocReference(ref);
    const now = Timestamp.now();
    const finalData = { ...data, createdAt: now, updatedAt: now };
    await firestoreSetDoc(docRef, finalData);
    return { ...(finalData as T), id: docRef.id };
  };
}

export function updateDoc<T>(ref: string) {
  return async (id: string, data: Partial<WithFieldValue<T>>) => {
    const docRef = getDocReference(`${ref}/${id}`);
    const finalData = { ...data, updatedAt: Timestamp.now() };
    await firestoreUpdateDoc(docRef, finalData);
    return { ...(finalData as T), id: docRef.id };
  };
}

export function getDoc<T>(ref: string) {
  return async (id: string): Promise<T | null> => {
    const docRef = getDocReference(`${ref}/${id}`);
    const docSnap = await firestoreGetDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as T;
    }
    return null;
  };
}

export function deleteDoc(ref: string) {
  return async (id: string): Promise<void> => {
    const docRef = getDocReference(`${ref}/${id}`);
    await firestoreDeleteDoc(docRef);
  };
}

/**
 * Generic function to get all documents from a collection using the same pattern as react-firebase-hooks
 */
export async function getAllFromCollection<T>(
  collectionName: string,
  converter: FirestoreDataConverter<T>
): Promise<T[]> {
  try {
    const collectionQuery = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    ).withConverter(converter);

    const querySnapshot = await getDocs(collectionQuery);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(`Error getting all ${collectionName}:`, error);
    return [];
  }
}

// Re-export arrayUnion for atomic array updates
export const arrayUnion = firestoreArrayUnion;

export default db;
