import { CreateDesignResponse } from "@/actions/openai";
import { Timestamp } from "firebase/firestore";

export interface AiReponse extends Omit<CreateDesignResponse, "b64_json"> {
  id: string;
  imageUrl: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
