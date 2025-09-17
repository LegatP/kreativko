import db from "@/lib/firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { Asset } from "../assets";

const collectionName = "configurations";

interface Configuration {
  product: string;
  color: string;
  assets: Asset[];
}

export async function createConfiguration(data: Configuration) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
