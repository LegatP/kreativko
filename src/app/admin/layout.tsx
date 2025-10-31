"use client";

import AdminNavigation from "@/components/layout/AdminNavigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { replace } = useRouter();

  useEffect(() => {
    console.log("Admin layout loaded");
    if (process.env.NODE_ENV === "production") {
      replace("/");
    }
  }, [replace]);

  return (
    <div className="pl-20 py-10 pr-10">
      <AdminNavigation />
      {children}
    </div>
  );
}
