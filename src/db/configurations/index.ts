import auth from "@/lib/firebase/auth";
import db, { addDoc, updateDoc } from "@/lib/firebase/firestore";
import { DesignStyle, Product, ProductConfigs } from "@/types/product.types";
import { collection, doc, DocumentReference, getDoc } from "firebase/firestore";

const collectionPath = function () {
  return `users/${auth.currentUser!.uid}/configurations`;
};

export interface Configuration {
  id?: string;
  assets: Record<string, string>;
  configs: ProductConfigs;
  designStyle: DesignStyle;
  selectedProduct: Product;
}

export async function getConfigurationById(id: string) {
  try {
    const docRef = doc(collection(db, collectionPath()), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Configuration & {
        id: string;
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
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
  ref: DocumentReference | string,
  data: Partial<Configuration>
) {
  try {
    await updateDoc(ref, data);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
