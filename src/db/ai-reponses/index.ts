import { CreateShirtPatternResponse } from "@/actions/openai";
import { addDoc, updateDoc } from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";
export interface AiReponse
  extends Omit<CreateShirtPatternResponse, "b64_json"> {
  id: string;
  imageUrl: string;
  userId: string;
  createdAt: Timestamp;
}

const collectionName = "ai_responses";

export const createAiReponse = addDoc<AiReponse>(collectionName);

export const updateAiReponse = updateDoc<AiReponse>(collectionName);
