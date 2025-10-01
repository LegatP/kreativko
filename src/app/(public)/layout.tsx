"use client";

import Navigation from "../../components/layout/Navigation";
import CheckoutDrawer from "@/components/layout/CheckoutDrawer/CheckoutDrawer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
      <CheckoutDrawer />
    </>
  );
}
