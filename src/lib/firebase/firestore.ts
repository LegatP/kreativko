import app from "./init";
import {
  addDoc as firestoreAddDoc,
  updateDoc as firestoreUpdateDoc,
  collection,
  doc,
  DocumentData,
  WithFieldValue,
  CollectionReference,
  initializeFirestore,
  DocumentReference,
} from "firebase/firestore";

const db = initializeFirestore(app, {}, "default");

export async function addDoc<T>(
  ref: string | CollectionReference<DocumentData>,
  data: WithFieldValue<DocumentData>
): Promise<T & { id: string }> {
  const finalData = { ...data, createdAt: new Date() };

  let docRef;
  if (typeof ref === "string") {
    const colRef = collection(db, ref);
    docRef = await firestoreAddDoc(colRef, finalData);
  } else {
    docRef = await firestoreAddDoc(ref, finalData);
  }

  return { ...(data as T), id: docRef.id };
}

export function updateDoc(
  ref: string | DocumentReference<DocumentData, WithFieldValue<DocumentData>>,
  data: Partial<WithFieldValue<DocumentData>>
) {
  if (typeof ref === "string") {
    const docRef = doc(db, ref);
    return firestoreUpdateDoc(docRef, data);
  }

  return firestoreUpdateDoc(ref, data);
}

export default db;
