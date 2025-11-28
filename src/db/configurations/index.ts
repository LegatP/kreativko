/* eslint-disable @typescript-eslint/no-unused-vars */
import { DesignStyle, Product, ProductConfigs } from "@/types/product.types";
import { DocumentReference } from "firebase/firestore";

// function collectionPath() {
//   return `users/${auth.currentUser!.uid}/configurations`;
// }

export interface Configuration {
  id?: string;
  assets: Record<string, string>;
  configs: ProductConfigs;
  designStyle: DesignStyle;
  selectedProduct: Product;
  viewState?: {
    currentView: "front" | "back";
    umbrellaRotation: number;
  };
}

export async function getConfigurationById(id: string) {
  throw new Error("Needs to be updated implemented yet, not in use.");
  // try {
  //   const docRef = doc(collection(db, collectionPath()), id);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const data = docSnap.data() as Configuration;
  //     // Ensure viewState exists for backward compatibility
  //     const configWithDefaults = {
  //       id: docSnap.id,
  //       ...data,
  //       viewState: data.viewState || {
  //         currentView: "front" as const,
  //         umbrellaRotation: 0,
  //       },
  //     };
  //     return configWithDefaults as Configuration & { id: string };
  //   } else {
  //     console.log("No such document!");
  //     return null;
  //   }
  // } catch (error) {
  //   console.error("Error getting document:", error);
  //   return null;
  // }
}

export async function createConfiguration(data: Configuration) {
  throw new Error("Needs to be updated implemented yet, not in use.");
  // try {
  //   const docRef = await addDoc(collection(db, collectionPath()), data);
  //   return docRef;
  // } catch (error) {
  //   console.error("Error adding document: ", error);
  // }
}

export async function updateConfiguration(
  ref: DocumentReference | string,
  data: Partial<Configuration>
) {
  throw new Error("Needs to be updated implemented yet, not in use.");
  // try {
  //   // If ref is a string (document ID), build the full path
  //   if (typeof ref === "string") {
  //     const fullPath = `${collectionPath()}/${ref}`;
  //     await updateDoc(fullPath, data);
  //   } else {
  //     await updateDoc(ref, data);
  //   }
  // } catch (error) {
  //   console.error("Error updating document: ", error);
  // }
}
