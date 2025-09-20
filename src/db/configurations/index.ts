import auth from "@/lib/firebase/auth";
import db, { updateDoc } from "@/lib/firebase/firestore";
import { addDoc, collection, DocumentReference } from "firebase/firestore";

const collectionPath = function () {
  return `users/${auth.currentUser!.uid}/configurations`;
};

export interface Configuration {
  product: string;
  // key: assetId, value: url
  assets: Record<string, string>;
  shirtConfig: {
    color: string;
    frontPatternUrl: string;
    model: "male" | "female";
  };
}

export async function createConfiguration(data: Configuration) {
  try {
    const docRef = await addDoc(collection(db, collectionPath()), data);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function updateConfiguration(
  ref: DocumentReference,
  data: Partial<Configuration>
) {
  try {
    await updateDoc(ref, data);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
