import auth from "@/lib/firebase/auth";
import { AddDocumentData } from "@/lib/firebase/firestore";
import { createCollection } from "../createCollection";
import { Timestamp } from "firebase/firestore";

export interface Asset {
  id: string;
  url: string;
  title?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper to get user-specific assets collection
function getAssetsCollection() {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User must be authenticated");
  return createCollection<Asset>(`users/${userId}/assets`);
}

// Convenience functions
export async function createAsset(data: AddDocumentData<Asset>) {
  return getAssetsCollection().create(data);
}

export async function getAsset(id: string) {
  return getAssetsCollection().get(id);
}

export function useUserAssets() {
  return getAssetsCollection().useCollection();
}
