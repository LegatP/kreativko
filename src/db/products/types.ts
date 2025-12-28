import { Timestamp } from "firebase/firestore";

export interface PromptSuggestionVariable {
  key: string; // Variable key like "name", "age"
  label: string; // Display label like "Ime", "Starost"
  placeholder: string; // Placeholder text
  defaultValue: string; // Default value shown to user (user never sees variable name)
}

export interface PromptSuggestion {
  prompt: string; // Prompt with variables like "Ustvari motiv za {{name}} ki praznuje {{age}} let"
  variables: PromptSuggestionVariable[];
}

export interface ProductDesign {
  title: string;
  url: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  promptSuggestions?: PromptSuggestion[];
  designs: ProductDesign[];
  categoryIds?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
