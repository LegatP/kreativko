import auth from "@/lib/firebase/auth";
import db, { updateDoc } from "@/lib/firebase/firestore";
import { DesignStyle, Product, ProductConfigs } from "@/types/product.types";
import { addDoc, collection, DocumentReference } from "firebase/firestore";

const collectionPath = function () {
  return `users/${auth.currentUser!.uid}/configurations`;
};

export interface Configuration {
  assets: Record<string, string>;
  configs: ProductConfigs;
  designStyle: DesignStyle;
  selectedProduct: Product;
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
