"use client";

import AdminNavigation from "@/components/layout/AdminNavigation";
import auth from "@/lib/firebase/auth";
import ROUTES from "@/utils/routes.utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { replace } = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    // TODO: improve admin auth check => should check for admin
    if (!user || user.isAnonymous) {
      replace(ROUTES.home);
    }
  }, [replace, user]);

  return (
    <div className="pl-20 py-10 pr-10">
      <AdminNavigation />
      {children}
    </div>
  );
}
