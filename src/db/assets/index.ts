import auth from "@/lib/firebase/auth";
import { addDoc } from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";

export interface Asset {
  id: string;
  url: string;
  title?: string;
  createdAt: Timestamp;
}

function collectionPath() {
  return `users/${auth.currentUser!.uid}/assets`;
}

export const createAsset = addDoc<Asset>(collectionPath);
