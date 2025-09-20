import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { cookies } from "next/headers";
import app from "./init";

export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get("__session")?.value;

  const firebaseServerApp = initializeServerApp(app.options, {
    authIdToken,
  });

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, user: auth.currentUser };
}
