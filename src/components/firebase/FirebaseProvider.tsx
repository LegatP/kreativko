"use client";

import React from "react";
import { useEffect } from "react";
import auth, { onIdTokenChanged, signIn } from "@/lib/firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      signIn();
    }
  }, []);

  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      setLoading(false);
    });
  }, []);

  return <>{loading ? null : children}</>;
}
