import app from "./init";
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";

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

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error signing in with email", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error creating account", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error sending password reset email", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
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
