import { ref } from "firebase/database";
import fb from "./init";
import {
  addDoc as firestoreAddDoc,
  collection,
  DocumentData,
  getFirestore,
  WithFieldValue,
  CollectionReference,
  initializeFirestore,
} from "firebase/firestore";

const db = initializeFirestore(fb, {}, "default");

export function addDoc(
  ref: string | CollectionReference<DocumentData>,
  data: WithFieldValue<DocumentData>
) {
  const finalData = { ...data, createdAt: new Date() };

  if (typeof ref === "string") {
    console.log("string refernece");
    const colRef = collection(db, ref);
    return firestoreAddDoc(colRef, finalData);
  }

  return firestoreAddDoc(ref, finalData);
}
