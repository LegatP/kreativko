"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import FirebaseProvider from "@/components/firebase/FirebaseProvider";
import { CheckoutContextProvider } from "@/components/contexts/CheckoutContext";
import { CreateDesignContextProvider } from "@/components/contexts/CreateDesignContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <FirebaseProvider>
        <CheckoutContextProvider>
          <CreateDesignContextProvider>
            {children}
          </CreateDesignContextProvider>
        </CheckoutContextProvider>
      </FirebaseProvider>
    </HeroUIProvider>
  );
}
