"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useAppConfig, AppConfig } from "@/db/config";
import { useCategories } from "@/db/product-categories";
import { ProductCategory } from "@/db/product-categories";

interface ConfigContextType {
  // Raw config data
  config: AppConfig | undefined;
  configLoading: boolean;
  configError: Error | undefined;

  // Used in: src/components/features/wizard/steps/TemplatesStep.tsx
  // Resolved wizard categories (with full category data)
  wizardCategories: ProductCategory[];
  wizardCategoriesLoading: boolean;

  // NOT YET USED - for future landing page implementation
  // Resolved landing page categories
  landingPageCategories: ProductCategory[];
  landingPageCategoriesLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Fetch config
  const [config, configLoading, configError] = useAppConfig();

  // Fetch all categories to resolve IDs to full objects
  const [allCategories, categoriesLoading] = useCategories();

  // Resolve wizard category IDs to full category objects
  // If no config exists, return empty array (no categories shown)
  const wizardCategories = useMemo(() => {
    if (!config?.wizardCategoryIds || !allCategories) return [];

    // Maintain order from config
    return config.wizardCategoryIds
      .map((id) => allCategories.find((cat) => cat.id === id))
      .filter((cat): cat is ProductCategory => cat !== undefined);
  }, [config?.wizardCategoryIds, allCategories]);

  // Resolve landing page category IDs to full category objects
  const landingPageCategories = useMemo(() => {
    if (!config?.landingPageCategoryIds || !allCategories) return [];

    return config.landingPageCategoryIds
      .map((id) => allCategories.find((cat) => cat.id === id))
      .filter((cat): cat is ProductCategory => cat !== undefined);
  }, [config?.landingPageCategoryIds, allCategories]);

  const isLoading = configLoading || categoriesLoading;

  return (
    <ConfigContext.Provider
      value={{
        config,
        configLoading,
        configError,
        wizardCategories,
        wizardCategoriesLoading: isLoading,
        landingPageCategories,
        landingPageCategoriesLoading: isLoading,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "useConfigContext must be used within a ConfigContextProvider"
    );
  }
  return context;
};
