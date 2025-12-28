import { setDoc, AddDocumentData } from "@/lib/firebase/firestore";
import { createCollection } from "../createCollection";
import { UserProfile } from "./types";

export const USERS_COLLECTION = "users";

// Re-export types
export type { UserProfile };

const usersCollection = createCollection<UserProfile>(USERS_COLLECTION);

// Custom function for user creation - uses setDoc to set specific doc ID (user's UID)
export async function setUserProfile(
  userId: string,
  profile: AddDocumentData<UserProfile>
) {
  return setDoc<UserProfile>(`${USERS_COLLECTION}/${userId}`)(profile);
}

// Use collection methods for other operations
export const updateUserProfile = usersCollection.update;
export const getUserProfile = usersCollection.get;

// React Firebase Hooks
export const useUserProfile = usersCollection.useDoc;
export const useUserProfileOnce = usersCollection.useDocOnce;
