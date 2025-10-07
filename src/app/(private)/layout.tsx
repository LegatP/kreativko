"use client";

import Navigation from "@/components/layout/mavigation";
import CheckoutDrawer from "@/components/layout/CheckoutDrawer/CheckoutDrawer";
import auth from "@/lib/firebase/auth";
import ROUTES from "@/utils/routes.utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { replace } = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      replace(ROUTES.login);
    }
  }, [user, replace]);

  return (
    <>
      <Navigation />
      {children}
      <CheckoutDrawer />
    </>
  );
}
