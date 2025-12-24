"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import FirebaseProvider from "@/components/firebase/FirebaseProvider";
import { CheckoutContextProvider } from "@/components/contexts/CheckoutContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <FirebaseProvider>
        <CheckoutContextProvider>
          {/* <AppContextProvider>{children}</AppContextProvider> */}
          {children}
        </CheckoutContextProvider>
      </FirebaseProvider>
    </HeroUIProvider>
  );
}
