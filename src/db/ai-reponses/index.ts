import { CreateShirtPatternResponse } from "@/actions/openai";
import auth from "@/lib/firebase/auth";
import { addDoc } from "@/lib/firebase/firestore";

interface AiReponse extends Omit<CreateShirtPatternResponse, "b64_json"> {
  imageUrl: string;
  userId: string;
  createdAt: Date;
}

const collectionName = "ai_responses";

export async function createAiReponse(
  data: Omit<AiReponse, "createdAt" | "userId">
) {
  try {
    // @ts-expect-error -- b64_json is not part of AiReponse but is sometimes paased as data
    delete data.b64_json;
    const docRef = await addDoc(collectionName, {
      ...data,
      userId: auth.currentUser!.uid,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
