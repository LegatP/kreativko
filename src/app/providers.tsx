"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import FirebaseProvider from "@/components/firebase/FirebaseProvider";
import { ConfigContextProvider } from "@/components/contexts/ConfigContext";
import { CheckoutContextProvider } from "@/components/contexts/CheckoutContext";
import { CreateDesignContextProvider } from "@/components/contexts/CreateDesignContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <FirebaseProvider>
        <ConfigContextProvider>
          <CheckoutContextProvider>
            <CreateDesignContextProvider>
              {children}
            </CreateDesignContextProvider>
          </CheckoutContextProvider>
        </ConfigContextProvider>
      </FirebaseProvider>
    </HeroUIProvider>
  );
}
