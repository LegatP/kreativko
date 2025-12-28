import { createCollection } from "../createCollection";
import { AiReponse } from "./types";

// Re-export types
export type { AiReponse };

const AI_RESPONSES_COLLECTION = "ai_responses";

// Create the collection with full CRUD + hooks support
const aiResponsesCollection = createCollection<AiReponse>(AI_RESPONSES_COLLECTION);

// Export collection metadata
export { AI_RESPONSES_COLLECTION };
export const aiResponseConverter = aiResponsesCollection.converter;

// Export CRUD operations
export const createAiReponse = aiResponsesCollection.create;
export const updateAiReponse = aiResponsesCollection.update;
export const getAiReponse = aiResponsesCollection.get;
