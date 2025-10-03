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
      <div className="max-w-7xl w-full mx-auto px-6 pt-6">{children}</div>
      <CheckoutDrawer />
    </>
  );
}
