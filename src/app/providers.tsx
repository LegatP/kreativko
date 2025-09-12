"use client";

import { HeroUIProvider } from "@heroui/react";
import { AppContextProvider } from "../components/contexts/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </HeroUIProvider>
  );
}
