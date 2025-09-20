import app from "./init";
import { getAuth, signInAnonymously, User } from "firebase/auth";

const auth = getAuth(app);

// TODO: handle auth state changes and persist user session
// https://firebase.google.com/codelabs/firebase-nextjs#5

export async function signIn() {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Error signing in anonymously", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
}

export function onIdTokenChanged(callback: (user: User | null) => void) {
  return auth.onIdTokenChanged(callback);
}

export default auth;
