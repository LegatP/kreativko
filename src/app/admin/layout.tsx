"use client";

import AdminNavigation from "@/components/layout/AdminNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-20 py-10 pr-10">
      <AdminNavigation />
      {children}
    </div>
  );
}
