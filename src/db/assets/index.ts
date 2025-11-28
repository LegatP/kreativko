// import auth from "@/lib/firebase/auth";
// import { addDoc, AddDocumentData } from "@/lib/firebase/firestore";
// import { Timestamp } from "firebase/firestore";

// export interface Asset {
//   id: string;
//   url: string;
//   title?: string;
//   // type: string;
//   createdAt: Timestamp;
// }

// export type AssetData = AddDocumentData<Asset>;

// function collectionPath() {
//   return `users/${auth.currentUser!.uid}/assets`;
// }

// export const createAsset = addDoc<Asset>(collectionPath);
