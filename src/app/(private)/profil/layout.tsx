import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-white to-primary-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
