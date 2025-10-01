"use client";
import Navigation from "../../components/layout/Navigation";
import CheckoutDrawer from "@/components/layout/CheckoutDrawer/CheckoutDrawer";
import ROUTES from "@/utils/routes.utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import auth from "@/lib/firebase/auth";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { replace } = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      replace(ROUTES.orders);
    }
  }, [user, replace]);

  return (
    <>
      <Navigation />
      <div className="flex flex-col">{children}</div>
      <CheckoutDrawer />
    </>
  );
}
