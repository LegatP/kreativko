import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppState {
  color: string;
  shirtPatternUrl: string;
  gender: "male" | "female";
  size: "S" | "M" | "L" | "XL";
  imageUrl: string;
}

interface AppContextType {
  state: AppState;
  setState: (state: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    color: "#EFBD48",
    shirtPatternUrl: "",
    gender: "male",
    size: "M",
    imageUrl: "",
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
