"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AppContextProvider } from "../components/contexts/AppContext";
import FirebaseProvider from "@/components/firebase/FirebaseProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <AppContextProvider>
        <FirebaseProvider>{children}</FirebaseProvider>
      </AppContextProvider>
    </HeroUIProvider>
  );
}
