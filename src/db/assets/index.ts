import auth from "@/lib/firebase/auth";
import { addDoc } from "@/lib/firebase/firestore";

export interface Asset {
  url: string;
  type: string;
  createdAt: Date;
}

const collectionPath = function () {
  return `users/${auth.currentUser!.uid}/assets`;
};

export async function createAsset(
  data: Omit<Asset, "createdAt" | "userId">
): Promise<(Asset & { id: string }) | undefined> {
  try {
    return await addDoc(collectionPath(), data);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
