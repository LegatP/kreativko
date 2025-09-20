"use client";

import React from "react";
import { useEffect } from "react";
import auth, { onIdTokenChanged, signIn } from "@/lib/firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import app from "@/lib/firebase/init";

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
    const initializeAnalytics = async () => {
      getAnalytics(app);
      getPerformance(app);
    };

    initializeAnalytics();
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
