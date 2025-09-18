import { Asset } from "@/db/assets";
import {
  Configuration,
  createConfiguration,
  updateConfiguration,
} from "@/db/configurations";
import { create } from "domain";
import { set } from "firebase/database";
import { DocumentReference } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

// interface AppState {
//   color: string;
//   shirtPatternUrl: string;
//   gender: "male" | "female";
//   size: "S" | "M" | "L" | "XL";
//   imageUrl: string;
// }

interface LocalConfiguration extends Configuration {
  assets: Asset[];
}

interface AppContextType {
  state: LocalConfiguration;
  setState: (state: LocalConfiguration) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LocalConfiguration>({
    product: "shirt",
    shirtConfig: {
      color: "#EFBD48",
      frontPatternUrl: "",
      model: "male",
    },
    assetIds: [],
    assets: [],
  });

  const configDoc = useRef<DocumentReference | undefined>(undefined);

  useEffect(() => {
    if (configDoc.current) return;
    async function create() {
      const config = await createConfiguration(state);
      configDoc.current = config;
    }

    create();
  });

  async function setStatePrivate(state: Partial<LocalConfiguration>) {
    setState((prev) => ({ ...prev, ...state }));

    if (!configDoc.current) return;

    // Remove local-only properties before updating
    delete state.assets;

    await updateConfiguration(configDoc.current, state);
  }

  return (
    <AppContext.Provider value={{ state, setState: setStatePrivate }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "useAppStateContext must be used within an AppContextProvider"
    );
  }
  return context;
};
