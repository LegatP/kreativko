"use client";

import Navigation from "@/components/layout/Navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
      {/* <CheckoutDrawer /> */}
    </>
  );
}
