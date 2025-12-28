import { Timestamp } from "firebase/firestore";

export interface AppConfig {
  id: string;

  // Used in: src/components/features/wizard/steps/TemplatesStep.tsx
  // Shows these categories in the "Izberi kategorijo" step of the design wizard
  wizardCategoryIds: string[];

  // NOT YET USED - for future landing page implementation
  landingPageCategoryIds: string[];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Document ID for the singleton config document
export const CONFIG_DOC_ID = "app_config";
