"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import auth, { onIdTokenChanged, signIn } from "@/lib/firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { getAnalytics, setUserId } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import app from "@/lib/firebase/init";
import { signInAnonymously } from "firebase/auth";

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        getAnalytics(app);
        getPerformance(app);
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
        await signInAnonymously(auth);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <>{loading ? null : children}</>;
}
