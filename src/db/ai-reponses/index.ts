import { CreateShirtPatternResponse } from "@/actions/openai";
import { addDoc } from "@/lib/firebase/firestore";

interface AiReponse extends Omit<CreateShirtPatternResponse, "b64_json"> {
  imageUrl: string;
}

const collectionName = "ai_responses";

export async function createAiReponse(data: AiReponse) {
  try {
    const docRef = await addDoc(collectionName, data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
