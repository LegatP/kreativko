import { CreateShirtPatternResponse } from "@/actions/openai";
import auth from "@/lib/firebase/auth";
import db, { addDoc } from "@/lib/firebase/firestore";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

export interface AiReponse
  extends Omit<CreateShirtPatternResponse, "b64_json"> {
  id: string;
  imageUrl: string;
  userId: string;
  createdAt: Timestamp;
}

const collectionName = "ai_responses";

export async function createAiReponse(
  data: Omit<AiReponse, "createdAt" | "userId" | "id">
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

export async function getAiReponses() {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"),
        limit(20)
      )
    );
    const aiReponses: AiReponse[] = [];
    snapshot.forEach((doc) => {
      aiReponses.push({ id: doc.id, ...(doc.data() as Omit<AiReponse, "id">) });
    });
    return aiReponses;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}
