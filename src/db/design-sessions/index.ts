import { createCollection } from "../createCollection";
import { DesignSession } from "./types";

// Re-export types
export type { DesignSession };

const DESIGN_SESSIONS_COLLECTION = "design_sessions";

// Create the collection with full CRUD + hooks support
const designSessionsCollection = createCollection<DesignSession>(
  DESIGN_SESSIONS_COLLECTION
);

// Export collection metadata
export { DESIGN_SESSIONS_COLLECTION };
export const designSessionConverter = designSessionsCollection.converter;

// Export CRUD operations
export const createDesignSession = designSessionsCollection.create;
export const updateDesignSession = designSessionsCollection.update;
export const getDesignSession = designSessionsCollection.get;

// React Firebase Hooks
export const useDesignSessionOnce = designSessionsCollection.useDocOnce;
export const useDesignSessionListener = designSessionsCollection.useDoc;
