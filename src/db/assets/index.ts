import auth from "@/lib/firebase/auth";
import { addDoc } from "@/lib/firebase/firestore";

export interface Asset {
  url: string;
  type: string;
  createdAt: Date;
  userId: string;
}

const collectionName = "assets";

export async function createAsset(data: Omit<Asset, "createdAt">) {
  try {
    console.log("Creating asset with data:", collectionName, data);
    console.log("Current user:", auth.currentUser);
    const docRef = await addDoc(collectionName, {
      ...data,
      userId: auth.currentUser!.uid,
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
