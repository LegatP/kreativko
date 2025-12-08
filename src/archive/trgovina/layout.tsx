"use client";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="max-w-7xl w-full mx-auto px-6 pt-6">{children}</div>;
}
