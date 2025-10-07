import {
  Configuration,
  createConfiguration,
  updateConfiguration,
} from "@/db/configurations";
import {
  DesignStyle,
  HoodieSizes,
  Product,
  ProductConfigs,
  ShirtSizes,
  UmbrellaSizes,
} from "@/types/product.types";
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

// interface AppState {
//   designStyle: DesignStyle;
//   selectedProduct: Product;
//   productConfigs: ProductConfigs;
// }

interface AppContextType {
  state: Configuration;
  setState: (state: Configuration) => void;
  currentProductConfig: ProductConfigs[keyof ProductConfigs];
  setCurrentProductConfig: (
    configs: Partial<ProductConfigs[keyof ProductConfigs]>
  ) => void;
  setViewState: (viewState: Partial<Configuration["viewState"]>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Configuration>({
    designStyle: DesignStyle.Monotone,
    selectedProduct: Product.Shirt,
    viewState: {
      currentView: "front",
      umbrellaRotation: 0,
    },
    configs: {
      [Product.Shirt]: {
        color: "#EFBD48",
        frontPatternUrl: "",
        sizes: {
          [ShirtSizes.S]: 0,
          [ShirtSizes.M]: 0,
          [ShirtSizes.L]: 0,
          [ShirtSizes.XL]: 0,
          [ShirtSizes.XXL]: 0,
        },
        model: "male",
      },
      [Product.Hoodie]: {
        color: "#EFBD48",
        frontPatternUrl: "",
        sizes: {
          [HoodieSizes.S]: 0,
          [HoodieSizes.M]: 0,
          [HoodieSizes.L]: 0,
          [HoodieSizes.XL]: 0,
          [HoodieSizes.XXL]: 0,
        },
      },
      [Product.Umbrella]: {
        color: "#EFBD48",
        patternUrl: "",
        sizes: {
          [UmbrellaSizes.Standard]: 0,
        },
      },
    },
    assets: {},
  });

  const configDoc = useRef<{ id: string } | undefined>(undefined);

  useEffect(() => {
    if (configDoc.current) return;
    async function create() {
      const config = await createConfiguration(state);
      configDoc.current = config;
      setState((prev) => ({ ...prev, id: config?.id } as Configuration));
    }

    create();
  });

  async function setStatePrivate(state: Partial<Configuration>) {
    setState((prev) => ({ ...prev, ...state }));

    if (!configDoc.current) return;

    await updateConfiguration(configDoc.current.id, state);
  }

  function setCurrentProductConfig(
    configs: Partial<ProductConfigs[keyof ProductConfigs]>
  ) {
    console.log("Updating configs:", configs);
    setState((prev) => ({
      ...prev,
      configs: {
        ...prev.configs,
        [prev.selectedProduct]: {
          ...prev.configs[prev.selectedProduct],
          ...configs,
        },
      },
    }));
  }

  function setViewState(viewState: Partial<Configuration["viewState"]>) {
    setStatePrivate({
      viewState: {
        currentView: "front",
        umbrellaRotation: 0,
        ...state.viewState,
        ...viewState,
      },
    });
  }

  const currentProductConfig = state.configs[state.selectedProduct];

  return (
    <AppContext.Provider
      value={{
        state,
        setState: setStatePrivate,
        setCurrentProductConfig,
        currentProductConfig,
        setViewState,
      }}
    >
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
