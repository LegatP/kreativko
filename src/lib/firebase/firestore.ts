import app from "./init";
import {
  addDoc as firestoreAddDoc,
  updateDoc as firestoreUpdateDoc,
  getDoc as firestoreGetDoc,
  collection,
  doc,
  DocumentData,
  WithFieldValue,
  CollectionReference,
  initializeFirestore,
  DocumentReference,
  Timestamp,
  setDoc as firestoreSetDoc,
} from "firebase/firestore";

const db = initializeFirestore(
  app,
  {},
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE
);

export type AddDocumentData<T> = Omit<T, "id" | "createdAt">;

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
    const finalData = { ...data, createdAt: Timestamp.now() };
    const colRef = getCollectionReference(ref);
    const docRef = await firestoreAddDoc(colRef, finalData);
    return { ...finalData, id: docRef.id } as T;
  };
}

export function setDoc<T>(ref: string | DocumentReference<DocumentData>) {
  return async (
    data: WithFieldValue<DocumentData>
  ): Promise<T & { id: string }> => {
    const docRef = getDocReference(ref);
    await firestoreSetDoc(docRef, data);
    return { ...(data as T), id: docRef.id };
  };
}

export function updateDoc<T>(ref: string) {
  return async (id: string, data: Partial<WithFieldValue<T>>) => {
    const docRef = getDocReference(`${ref}/${id}`);
    await firestoreUpdateDoc(docRef, data);
    return { ...(data as T), id: docRef.id };
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

export default db;
