import db, { updateDoc } from "@/lib/firebase/firestore";
import { addDoc, collection, DocumentReference } from "firebase/firestore";

const collectionName = "configurations";

export interface Configuration {
  product: string;
  assetIds: string[];
  shirtConfig?: {
    color: string;
    frontPatternUrl: string;
    model: "male" | "female";
  };
}

export async function createConfiguration(data: Configuration) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
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
