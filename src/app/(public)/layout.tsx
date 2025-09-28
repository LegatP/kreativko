import { Drawer } from "@heroui/react";
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
      <div className="flex flex-col">{children}</div>
      <CheckoutDrawer />
    </>
  );
}
