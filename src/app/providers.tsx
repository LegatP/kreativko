"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AppContextProvider } from "../components/contexts/AppContext";
import FirebaseProvider from "@/components/firebase/FirebaseProvider";
import { Analytics } from "@vercel/analytics/next";
import { CheckoutContextProvider } from "@/components/contexts/AppContext/CheckoutContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Analytics />
      <ToastProvider placement="top-right" />
      <FirebaseProvider>
        <CheckoutContextProvider>
          <AppContextProvider>{children}</AppContextProvider>
        </CheckoutContextProvider>
      </FirebaseProvider>
    </HeroUIProvider>
  );
}
