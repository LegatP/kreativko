import db from "@/lib/firebase/firestore";
import {
  doc,
  getDoc as firestoreGetDoc,
  setDoc as firestoreSetDoc,
  updateDoc as firestoreUpdateDoc,
  Timestamp,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { createConverter } from "../createCollection";
import { AppConfig, CONFIG_DOC_ID } from "./types";

export type { AppConfig };
export { CONFIG_DOC_ID };

export const CONFIG_COLLECTION = "config";

const converter = createConverter<AppConfig>();

// Get document reference for the singleton config
const getConfigDocRef = () =>
  doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID).withConverter(converter);

/**
 * Get the app config. Returns null if it doesn't exist (no auto-create).
 */
export async function getAppConfig(): Promise<AppConfig | null> {
  const docRef = getConfigDocRef();
  const docSnap = await firestoreGetDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
}

/**
 * Create the app config (called from admin on first save)
 */
export async function createAppConfig(
  data: Pick<AppConfig, "wizardCategoryIds" | "landingPageCategoryIds">
): Promise<AppConfig> {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  const now = Timestamp.now();
  const configData = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await firestoreSetDoc(docRef, configData);
  return { ...configData, id: CONFIG_DOC_ID } as AppConfig;
}

/**
 * Update the app config
 */
export async function updateAppConfig(
  data: Partial<Pick<AppConfig, "wizardCategoryIds" | "landingPageCategoryIds">>
): Promise<void> {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  await firestoreUpdateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * React hook for real-time config updates.
 * Returns [config, loading, error] where config is undefined if not loaded or doesn't exist.
 */
export const useAppConfig = () => {
  const docRef = getConfigDocRef();
  return useDocumentData<AppConfig>(docRef);
};
