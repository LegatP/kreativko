"use client";

import React, { useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      signIn();
    }
  }, []);

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        console.log("[FirebaseProvider] Initializing analytics...");
        const analytics = getAnalytics(app);
        console.log("[FirebaseProvider] Analytics initialized:", analytics);

        getPerformance(app);
        console.log("[FirebaseProvider] Performance monitoring initialized");
      } catch (error) {
        console.error(
          "[FirebaseProvider] Error initializing analytics:",
          error
        );
      }
    };

    initializeAnalytics();
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      console.log("Firebase auth state changed. User:", user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <>{loading ? null : children}</>;
}
